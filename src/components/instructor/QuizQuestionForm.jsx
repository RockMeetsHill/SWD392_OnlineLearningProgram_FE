import { useState } from "react";
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    HStack,
    Text,
    Radio,
    RadioGroup,
    useColorModeValue,
    Box,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "./Icons";
import { quizAPI } from "../../services/quizService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const QUESTION_TYPES = [
    { value: "single_choice", label: "Trắc nghiệm (1 đáp án)" },
    { value: "multiple_choice", label: "Nhiều đáp án" },
    { value: "true_false", label: "Đúng / Sai" },
];

const QuizQuestionForm = ({ quizId, orderIndex, onSuccess, onCancel }) => {
    const [contentText, setContentText] = useState("");
    const [type, setType] = useState("single_choice");
    const [answers, setAnswers] = useState([
        { contentText: "", isCorrect: true },
        { contentText: "", isCorrect: false },
    ]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const textColor = useColorModeValue("gray.900", "white");

    const addAnswer = () => {
        setAnswers((prev) => [...prev, { contentText: "", isCorrect: false }]);
    };
    const removeAnswer = (idx) => {
        if (answers.length <= 2) return;
        setAnswers((prev) => prev.filter((_, i) => i !== idx));
    };
    const updateAnswer = (idx, field, value) => {
        setAnswers((prev) =>
            prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
        );
    };
    const setCorrect = (idx) => {
        setAnswers((prev) =>
            prev.map((a, i) => ({ ...a, isCorrect: i === idx }))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!contentText.trim()) {
            setError("Nội dung câu hỏi không được để trống");
            return;
        }
        const validAnswers = answers.filter((a) => a.contentText?.trim());
        if (validAnswers.length < 2) {
            setError("Cần ít nhất 2 đáp án");
            return;
        }
        const hasCorrect = validAnswers.some((a) => a.isCorrect);
        if (!hasCorrect) {
            setError("Chọn ít nhất một đáp án đúng");
            return;
        }
        setSaving(true);
        try {
            const questionAnswers = validAnswers.map((a, i) => ({
                contentText: a.contentText.trim(),
                isCorrect: !!a.isCorrect,
                orderIndex: i,
            }));
            await quizAPI.createQuestion(quizId, {
                contentText: contentText.trim(),
                type,
                orderIndex: orderIndex ?? 0,
                questionAnswers,
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Lỗi khi thêm câu hỏi");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            p={4}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            bg={useColorModeValue("gray.50", "gray.900")}
        >
            <VStack align="stretch" spacing={3}>
                <FormControl>
                    <FormLabel fontSize="sm" color={textColor}>Nội dung câu hỏi</FormLabel>
                    <Input
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        placeholder="Nhập câu hỏi..."
                        size="sm"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel fontSize="sm" color={textColor}>Loại câu hỏi</FormLabel>
                    <Select
                        size="sm"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {QUESTION_TYPES.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel fontSize="sm" color={textColor}>Đáp án</FormLabel>
                    <RadioGroup
                        value={answers.findIndex((a) => a.isCorrect) >= 0 ? answers.findIndex((a) => a.isCorrect).toString() : "0"}
                        onChange={(idx) => setCorrect(parseInt(idx, 10))}
                    >
                        <VStack align="stretch" spacing={2}>
                            {answers.map((a, idx) => (
                                <HStack key={idx}>
                                    <Radio value={idx.toString()} size="sm" />
                                    <Input
                                        size="sm"
                                        value={a.contentText}
                                        onChange={(e) => updateAnswer(idx, "contentText", e.target.value)}
                                        placeholder={`Đáp án ${idx + 1}`}
                                        flex={1}
                                    />
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => removeAnswer(idx)}
                                        isDisabled={answers.length <= 2}
                                        leftIcon={<DeleteIcon boxSize={3} />}
                                    >
                                        Xóa
                                    </Button>
                                </HStack>
                            ))}
                        </VStack>
                    </RadioGroup>
                    <Button
                        size="xs"
                        mt={2}
                        leftIcon={<AddIcon boxSize={3} />}
                        variant="outline"
                        onClick={addAnswer}
                    >
                        Thêm đáp án
                    </Button>
                </FormControl>
                {error && <Text fontSize="sm" color="red.500">{error}</Text>}
                <HStack>
                    <Button
                        type="submit"
                        size="sm"
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        isLoading={saving}
                    >
                        Thêm câu hỏi
                    </Button>
                    {onCancel && (
                        <Button size="sm" variant="ghost" onClick={onCancel}>
                            Hủy
                        </Button>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
};

export default QuizQuestionForm;
