import { Box, Text, Button, VStack, useColorModeValue } from "@chakra-ui/react";
import { BookIcon } from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const EmptyState = ({ message, onCreateClick }) => {
    const color = useColorModeValue("gray.500", "gray.400");

    return (
        <Box textAlign="center" py={20} px={10}>
            <VStack spacing={4}>
                <BookIcon boxSize={16} color={color} opacity={0.7} />
                <Text color={color} fontSize="lg">
                    {message}
                </Text>
                {onCreateClick && (
                    <Button
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        fontWeight="bold"
                        size="lg"
                        onClick={onCreateClick}
                        _hover={{ opacity: 0.9 }}
                    >
                        Create your first course
                    </Button>
                )}
            </VStack>
        </Box>
    );
};

export default EmptyState;
