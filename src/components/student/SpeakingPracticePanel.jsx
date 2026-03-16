import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Badge,
    Box,
    Button,
    HStack,
    Text,
    Textarea,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { aiAPI } from "../../services/aiService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const SpeakingPracticePanel = ({ lessonId }) => {
    const [transcriptText, setTranscriptText] = useState("");
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const recognitionRef = useRef(null);

    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const alertStatus = transcriptText ? "info" : "error";

    const loadHistory = async () => {
        if (!lessonId) return;
        setIsLoading(true);
        try {
            const data = await aiAPI.getSpeakingHistory(lessonId);
            setHistory(data.logs || []);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.message || "Failed to load speaking history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTranscriptText("");
        setIsRecording(false);
        loadHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    const handleRecord = () => {
        setErrorMessage("");
        const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsRecording(true);
            setErrorMessage("Speech recognition is unavailable here. Type your transcript manually, then stop and submit.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0]?.transcript || "")
                .join(" ")
                .trim();
            setTranscriptText(transcript);
        };
        recognition.onerror = () => {
            setErrorMessage("Voice not recognized, please try again in a quiet environment.");
            setIsRecording(false);
        };
        recognition.onend = () => {
            setIsRecording(false);
        };
        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    };

    const handleStop = () => {
        recognitionRef.current?.stop?.();
        setIsRecording(false);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrorMessage("");
        try {
            await aiAPI.submitSpeakingPractice(lessonId, {
                transcriptText,
            });
            setTranscriptText("");
            await loadHistory();
        } catch (error) {
            setErrorMessage(error.message || "Failed to analyze speaking practice");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <VStack align="stretch" spacing={4}>
                <Box>
                    <Text fontWeight="bold" color={textColor}>
                        AI Speaking Practice
                    </Text>
                    <Text color={mutedColor} mt={1}>
                        Record or type your answer, then submit to receive pronunciation and fluency feedback.
                    </Text>
                </Box>

                {errorMessage && (
                    <Alert status={alertStatus} borderRadius="lg">
                        <AlertIcon />
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <HStack spacing={3}>
                    <Button
                        size="sm"
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        fontWeight="bold"
                        onClick={handleRecord}
                        isDisabled={isRecording}
                    >
                        Record
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleStop} isDisabled={!isRecording}>
                        Stop
                    </Button>
                    {isRecording && <Badge colorScheme="red">Recording</Badge>}
                </HStack>

                <Textarea
                    rows={5}
                    value={transcriptText}
                    onChange={(event) => setTranscriptText(event.target.value)}
                    placeholder="Your spoken transcript will appear here. You can also type it manually."
                />

                <Button
                    alignSelf="flex-start"
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                >
                    Submit Speaking Practice
                </Button>

                <Box>
                    <Text fontWeight="semibold" color={textColor} mb={2}>
                        Practice History
                    </Text>
                    {isLoading ? (
                        <Text color={mutedColor}>Loading history...</Text>
                    ) : history.length === 0 ? (
                        <Text color={mutedColor}>No speaking attempts yet.</Text>
                    ) : (
                        <VStack align="stretch" spacing={3}>
                            {history.map((item) => (
                                <Box key={item.logId} border="1px" borderColor={borderColor} borderRadius="lg" p={3}>
                                    <HStack spacing={3} mb={2}>
                                        <Badge colorScheme="green">Pronunciation: {item.pronunciationScore}</Badge>
                                        <Badge colorScheme="blue">Fluency: {item.fluencyScore}</Badge>
                                    </HStack>
                                    <Text color={textColor} whiteSpace="pre-wrap">
                                        {item.transcriptText}
                                    </Text>
                                    {(item.errorsDetected || []).length > 0 && (
                                        <Text mt={2} color={mutedColor}>
                                            Highlights: {(item.errorsDetected || []).join(" ")}
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};

SpeakingPracticePanel.propTypes = {
    lessonId: PropTypes.number,
};

export default SpeakingPracticePanel;
