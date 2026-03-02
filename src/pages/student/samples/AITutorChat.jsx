import { useState, useRef, useEffect } from "react";
import {
    Box,
    VStack,
    Text,
    Input,
    Button,
    useColorModeValue,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { aiAPI } from "../../../services/aiService";
import { PRIMARY_COLOR } from "../../../components/constants/instructor";

const AITutorChat = ({ lessonId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const toast = useToast();
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const bubbleUser = useColorModeValue(`${PRIMARY_COLOR}30`, `${PRIMARY_COLOR}20`);
    const bubbleAi = useColorModeValue("gray.100", "gray.700");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || !lessonId) return;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setLoading(true);
        try {
            const res = await aiAPI.chatWithTutor(lessonId, text);
            const reply = res?.response ?? "Không có phản hồi.";
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: err.message || "Không thể gửi tin nhắn",
                status: "error",
                duration: 3000,
            });
            setMessages((prev) => [...prev, { role: "assistant", content: `Lỗi: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    if (!lessonId) {
        return (
            <Text color={mutedColor} fontSize="sm">
                Choose a lesson to chat with the AI Tutor!F
            </Text>
        );
    }

    return (
        <Box
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderRadius="lg"
            overflow="hidden"
            bg={useColorModeValue("white", "gray.800")}
        >
            <Box p={3} borderBottom="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
                <Text fontWeight="semibold" color={textColor} fontSize="sm">
                    AI Tutor
                </Text>
            </Box>
            <VStack
                align="stretch"
                spacing={2}
                p={3}
                maxH="320px"
                overflowY="auto"
                minH="120px"
            >
                {messages.length === 0 && !loading && (
                    <Text color={mutedColor} fontSize="sm">
                        Ask me anything about this lesson!
                    </Text>
                )}
                {messages.map((m, i) => (
                    <Box
                        key={i}
                        alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
                        maxW="85%"
                        px={3}
                        py={2}
                        borderRadius="lg"
                        bg={m.role === "user" ? bubbleUser : bubbleAi}
                    >
                        <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                            {m.content}
                        </Text>
                    </Box>
                ))}
                {loading && (
                    <Box alignSelf="flex-start" px={3} py={2}>
                        <Spinner size="sm" color={PRIMARY_COLOR} />
                    </Box>
                )}
                <div ref={bottomRef} />
            </VStack>
            <Box p={2} borderTop="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
                <Box as="form" display="flex" gap={2} onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    <Input
                        size="sm"
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        isDisabled={loading}
                    />
                    <Button
                        size="sm"
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        type="submit"
                        isLoading={loading}
                    >
                        Ask
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AITutorChat;
