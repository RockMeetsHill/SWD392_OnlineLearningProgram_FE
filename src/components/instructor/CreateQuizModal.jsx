import { useState, useEffect, useRef } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Text,
    Flex,
    useColorModeValue,
    useToast,
    useDisclosure,
} from "@chakra-ui/react";
import { quizAPI } from "../../services/quizService";
import QuizQuestionForm from "./QuizQuestionForm";
import QuizQuestionList from "./QuizQuestionList";
import GenerateQuizWithAIModal from "./GenerateQuizWithAIModal";
import { AddIcon } from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const CreateQuizModal = ({ isOpen, onClose, lessonId, lessonTitle, onSuccess }) => {
    const [view, setView] = useState("list");
    const [quizList, setQuizList] = useState([]);
    const [title, setTitle] = useState("");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
    const [passingScore, setPassingScore] = useState(60);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [creating, setCreating] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const { isOpen: isAIOpen, onOpen: onAIOpen, onClose: onAIClose } = useDisclosure();
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const textColor = useColorModeValue("gray.900", "white");
    const modalContentBg = useColorModeValue("white", "gray.800");
    const listItemBg = useColorModeValue("gray.50", "gray.700");
    const toast = useToast();
    const ignoreLoadRef = useRef(false);

    const fetchQuizList = () => {
        if (!lessonId) return Promise.resolve([]);
        return quizAPI.getQuizzes(lessonId).then((list) => {
            const arr = Array.isArray(list) ? list : [];
            setQuizList(arr);
            return arr;
        });
    };

    useEffect(() => {
        if (!isOpen || !lessonId) return;
        ignoreLoadRef.current = false;
        setLoadingList(true);
        fetchQuizList()
            .then((arr) => {
                if (ignoreLoadRef.current) return;
                if (arr.length === 0) {
                    setView("form");
                    setQuiz(null);
                    setQuestions([]);
                } else {
                    setView("list");
                }
            })
            .catch(() => {
                if (!ignoreLoadRef.current) setView("list");
            })
            .finally(() => setLoadingList(false));
    }, [isOpen, lessonId]);

    const handleCreateEmpty = async () => {
        if (!lessonId) return;
        if (!title.trim()) {
            toast({ title: "Nhập tiêu đề quiz", status: "warning", duration: 3000 });
            return;
        }
        setCreating(true);
        try {
            const created = await quizAPI.createQuiz(lessonId, {
                title: title.trim(),
                timeLimitMinutes: Number(timeLimitMinutes) || 0,
                passingScore: Number(passingScore) || 60,
            });
            setQuiz(created);
            setQuestions(created.questions || []);
            setView("questions");
            if (onSuccess) onSuccess();
        } catch (err) {
            toast({ title: "Lỗi", description: err.message, status: "error", duration: 3000 });
        } finally {
            setCreating(false);
        }
    };

    const handleAddNewQuiz = () => {
        setTitle("");
        setTimeLimitMinutes(0);
        setPassingScore(60);
        setQuiz(null);
        setQuestions([]);
        setView("form");
    };

    const handleEditQuiz = (q) => {
        quizAPI.getQuizById(q.quizId).then((fullQuiz) => {
            setQuiz(fullQuiz);
            setQuestions(fullQuiz.questions || []);
            setView("questions");
        }).catch(() => toast({ title: "Lỗi", description: "Không tải được quiz", status: "error" }));
    };

    const handleBackToList = () => {
        setQuiz(null);
        setQuestions([]);
        fetchQuizList().then((arr) => {
            setView(arr.length === 0 ? "form" : "list");
        });
    };

    const handleAISaved = (createdQuiz) => {
        if (createdQuiz == null) {
            console.error("[CreateQuizModal] handleAISaved nhận undefined/null – API có thể trả sai format", createdQuiz);
            toast({ title: "Lỗi", description: "Không nhận được dữ liệu từ server. Mở Console (F12) xem chi tiết.", status: "error", duration: 6000 });
            onAIClose();
            return;
        }
        createdQuiz = createdQuiz?.data ?? createdQuiz;
        if (createdQuiz && createdQuiz.quizId) {
            ignoreLoadRef.current = true;
            const questionsList = Array.isArray(createdQuiz.questions) ? createdQuiz.questions : [];
            setQuiz(createdQuiz);
            setQuestions(questionsList);
            setView("questions");
            if (questionsList.length === 0) {
                console.error("[CreateQuizModal] Server trả về 0 câu hỏi. Response:", { quizId: createdQuiz.quizId, questions: createdQuiz.questions });
                toast({ title: "Cảnh báo", description: "Server trả về 0 câu hỏi. Kiểm tra backend hoặc Console (F12).", status: "warning", duration: 6000 });
            }
            onAIClose();
            if (onSuccess) onSuccess();
            return;
        }
        console.warn("[CreateQuizModal] Response không có quizId, sẽ refetch. Payload:", createdQuiz);
        toast({ title: "Đang tải lại...", description: "Server trả thiếu quizId, đang lấy lại dữ liệu.", status: "info", duration: 3000 });
        onAIClose();
        if (onSuccess) onSuccess();
        if (lessonId) {
            quizAPI.getQuizzes(lessonId).then((list) => {
                const arr = Array.isArray(list) ? list : [];
                if (arr.length > 0) return quizAPI.getQuizById(arr[arr.length - 1].quizId);
                return null;
            }).then((fullQuiz) => {
                if (fullQuiz) {
                    setQuiz(fullQuiz);
                    setQuestions(fullQuiz.questions ?? []);
                    setView("questions");
                } else {
                    handleClose();
                }
            }).catch((err) => {
                console.error("[CreateQuizModal] Refetch quiz thất bại:", err);
                toast({ title: "Lỗi", description: "Không tải lại được quiz. Xem Console (F12).", status: "error", duration: 5000 });
                handleClose();
            });
        } else {
            handleClose();
        }
    };

    const handleQuestionAdded = () => {
        if (!quiz?.quizId) return;
        quizAPI.getQuizById(quiz.quizId).then((q) => {
            setQuiz(q);
            setQuestions(q.questions || []);
        }).catch(() => {});
        onFormClose();
    };

    const handleRefreshQuestions = () => {
        if (!quiz?.quizId) return;
        quizAPI.getQuizById(quiz.quizId).then((q) => {
            setQuiz(q);
            setQuestions(q.questions || []);
        }).catch(() => {});
    };

    const handleClose = () => {
        ignoreLoadRef.current = false;
        setView("list");
        setTitle("");
        setTimeLimitMinutes(0);
        setPassingScore(60);
        setQuiz(null);
        setQuestions([]);
        setQuizList([]);
        onFormClose();
        onAIClose();
        onClose();
    };

    const renderList = () => (
        <VStack align="stretch" spacing={3}>
            {loadingList ? (
                <Text fontSize="sm" color={textColor}>Đang tải...</Text>
            ) : quizList.length === 0 ? (
                <Text fontSize="sm" color="gray.500">Chưa có quiz. Thêm quiz mới bên dưới.</Text>
            ) : (
                quizList.map((q) => (
                    <Flex key={q.quizId} justify="space-between" align="center" p={2} borderRadius="md" bg={listItemBg}>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>{q.title || "Quiz"}</Text>
                        <Button size="sm" variant="outline" onClick={() => handleEditQuiz(q)}>Sửa</Button>
                    </Flex>
                ))
            )}
            <Button size="sm" leftIcon={<AddIcon boxSize={4} />} bg={PRIMARY_COLOR} color="#0A1926" onClick={handleAddNewQuiz}>
                Thêm quiz mới
            </Button>
        </VStack>
    );

    const renderForm = () => (
        <VStack align="stretch" spacing={4}>
            <FormControl>
                <FormLabel fontSize="sm" color={textColor}>Tiêu đề</FormLabel>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tên quiz"
                    size="sm"
                />
            </FormControl>
            <FormControl>
                <FormLabel fontSize="sm" color={textColor}>Thời gian (phút, 0 = không giới hạn)</FormLabel>
                <NumberInput
                    min={0}
                    value={timeLimitMinutes}
                    onChange={(_, v) => setTimeLimitMinutes(v ?? 0)}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel fontSize="sm" color={textColor}>Điểm đạt (%)</FormLabel>
                <NumberInput
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(_, v) => setPassingScore(v ?? 60)}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>
        </VStack>
    );

    const renderQuestions = () => (
        <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color={textColor}>
                Quiz: {quiz?.title}. Đã có {questions.length} câu.
            </Text>
            <QuizQuestionList
                questions={questions}
                quizId={quiz?.quizId}
                onUpdate={handleRefreshQuestions}
            />
            {!isFormOpen ? (
                <Button size="sm" variant="outline" colorScheme="blue" onClick={onFormOpen}>
                    Thêm câu hỏi thủ công
                </Button>
            ) : (
                <QuizQuestionForm
                    quizId={quiz?.quizId}
                    orderIndex={questions.length}
                    onSuccess={handleQuestionAdded}
                    onCancel={onFormClose}
                />
            )}
            <Button size="sm" bg={PRIMARY_COLOR} color="#0A1926" onClick={onAIOpen}>
                Tạo bằng AI (Gemini)
            </Button>
        </VStack>
    );

    const headerTitle = view === "list" ? "Quiz" : view === "form" ? "Tạo quiz" : "Thêm câu hỏi";

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
                <ModalOverlay />
                <ModalContent bg={modalContentBg}>
                    <ModalHeader color={textColor}>
                        {headerTitle}
                        {lessonTitle ? ` – ${lessonTitle}` : ""}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {view === "list" && renderList()}
                        {view === "form" && renderForm()}
                        {view === "questions" && renderQuestions()}
                    </ModalBody>
                    <ModalFooter>
                        {view === "list" && (
                            <Button variant="ghost" onClick={handleClose}>Đóng</Button>
                        )}
                        {view === "form" && (
                            <>
                                <Button variant="ghost" mr={3} onClick={quizList.length > 0 ? handleBackToList : handleClose}>
                                    Hủy
                                </Button>
                                <Button
                                    bg={PRIMARY_COLOR}
                                    color="#0A1926"
                                    onClick={handleCreateEmpty}
                                    isLoading={creating}
                                >
                                    Tạo quiz trống
                                </Button>
                                <Button variant="outline" onClick={onAIOpen}>
                                    Tạo bằng AI
                                </Button>
                            </>
                        )}
                        {view === "questions" && (
                            <>
                                <Button variant="ghost" mr={3} onClick={handleBackToList}>
                                    Về danh sách
                                </Button>
                                <Button bg={PRIMARY_COLOR} color="#0A1926" onClick={handleClose}>
                                    Xong
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <GenerateQuizWithAIModal
                isOpen={isAIOpen}
                onClose={onAIClose}
                lessonId={lessonId}
                initialTitle={title || "Quiz"}
                initialLessonTitle={lessonTitle}
                initialTimeLimit={timeLimitMinutes}
                initialPassingScore={passingScore}
                existingQuestions={questions}
                onSaved={handleAISaved}
            />
        </>
    );
};

export default CreateQuizModal;
