import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { courseApprovalAPI } from "../../services/admin/courseApprovalService";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "");

const QuizIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3M15,14H13V16H11V14H9V12H11V10H13V12H15V14Z"
    />
  </Icon>
);

const buildUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

export default function QuizPreviewModal({ isOpen, onClose, quiz: quizProp }) {
  const toast = useToast();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);

  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");

  /* ── fetch full quiz ───────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen || !quizProp?.quizId) {
      setQuizData(null);
      return;
    }

    let cancelled = false;

    const fetchQuiz = async () => {
      setLoading(true);
      setQuizData(null);
      try {
        const data = await courseApprovalAPI.getQuizById(quizProp.quizId);
        if (!cancelled) setQuizData(data);
      } catch (error) {
        if (!cancelled) {
          toast({
            title: "Failed to load quiz",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuiz();
    return () => {
      cancelled = true;
    };
  }, [isOpen, quizProp, toast, onClose]);

  /* ── close handler ─────────────────────────────────────────── */
  const handleClose = () => {
    setQuizData(null);
    onClose();
  };

  const questions = quizData?.questions || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxH="85vh">
        <ModalHeader>
          <HStack spacing={2}>
            <QuizIcon boxSize={5} color="purple.500" />
            <Text>{quizData?.title || quizProp?.title || "Quiz Preview"}</Text>
          </HStack>
          {quizData && (
            <HStack mt={2} spacing={4} fontSize="xs" color={muted}>
              {quizData.timeLimitMinutes != null && (
                <Text>⏱ {quizData.timeLimitMinutes} min</Text>
              )}
              {quizData.passingScore != null && (
                <Text>✅ Pass: {quizData.passingScore}%</Text>
              )}
              <Text>📝 {questions.length} questions</Text>
            </HStack>
          )}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="lg" color="purple.500" />
            </Flex>
          ) : !quizData ? (
            <Text color={muted}>Failed to load quiz.</Text>
          ) : (
            <VStack align="stretch" spacing={6}>
              {quizData.description && (
                <Text fontSize="sm" color={muted}>
                  {quizData.description}
                </Text>
              )}

              {questions.map((question, qIdx) => (
                <Box
                  key={question.questionId || qIdx}
                  p={4}
                  borderRadius="lg"
                  border="1px"
                  borderColor={border}
                >
                  {/* Question header */}
                  <HStack mb={3} justify="space-between">
                    <Text fontWeight="semibold">
                      <Text as="span" color="blue.500">
                        Q{qIdx + 1}.
                      </Text>{" "}
                      {question.contentText || question.questionText || ""}
                    </Text>
                    {question.type && (
                      <Badge colorScheme="purple" fontSize="xs">
                        {question.type}
                      </Badge>
                    )}
                  </HStack>

                  {/* Question image */}
                  {question.mediaUrl && (
                    <Box mb={3}>
                      <Image
                        src={buildUrl(question.mediaUrl)}
                        alt={`Question ${qIdx + 1}`}
                        maxH="200px"
                        borderRadius="md"
                      />
                    </Box>
                  )}

                  {/* Answers */}
                  <Stack spacing={2}>
                    {(question.questionAnswers || question.answers || []).map(
                      (answer, aIdx) => (
                        <Flex
                          key={answer.answerId || aIdx}
                          p={3}
                          borderRadius="md"
                          bg={answer.isCorrect ? "green.50" : "transparent"}
                          border="1px"
                          borderColor={
                            answer.isCorrect ? "green.400" : border
                          }
                          align="center"
                          gap={3}
                        >
                          {/* Circle indicator */}
                          <Flex
                            w="20px"
                            h="20px"
                            minW="20px"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={
                              answer.isCorrect ? "green.500" : "gray.300"
                            }
                            align="center"
                            justify="center"
                          >
                            {answer.isCorrect && (
                              <Box
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg="green.500"
                              />
                            )}
                          </Flex>

                          <Text
                            fontSize="sm"
                            fontWeight={
                              answer.isCorrect ? "semibold" : "normal"
                            }
                            color={
                              answer.isCorrect ? "green.700" : "inherit"
                            }
                          >
                            {answer.contentText || answer.answerText || ""}
                            {answer.isCorrect && (
                              <Badge
                                ml={2}
                                colorScheme="green"
                                fontSize="xs"
                              >
                                Correct
                              </Badge>
                            )}
                          </Text>
                        </Flex>
                      ),
                    )}
                  </Stack>
                </Box>
              ))}

              {questions.length === 0 && (
                <Text color={muted} textAlign="center" py={4}>
                  No questions in this quiz.
                </Text>
              )}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}