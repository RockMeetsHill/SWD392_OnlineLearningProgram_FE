import {
    Box,
    Container,
    SimpleGrid,
    VStack,
    HStack,
    Text,
    Link as ChakraLink,
    useColorModeValue,
    IconButton,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const bgColor = useColorModeValue('gray.100', 'black')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const borderColor = useColorModeValue('gray.200', 'gray.800')

    return (
        <Box
            as="footer"
            bg={bgColor}
            pt={16}
            pb={8}
            borderTop="1px"
            borderColor={borderColor}
        >
            <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={12}>
                    {/* Brand */}
                    <VStack align="start">
                        <HStack spacing={2} mb={4}>
                            <Text
                                fontSize="2xl"
                                fontFamily="'Pacifico', cursive"
                                fontWeight="bold"
                                color={textColor}
                            >
                                BeeEnglish
                            </Text>
                            <Text fontSize="2xl">🐝</Text>
                        </HStack>
                        <Text color={mutedColor} fontSize="sm" mb={6}>
                            Empowering students to fly high with English skills for a global future.
                        </Text>
                        <HStack spacing={4}>
                            <IconButton
                                as="a"
                                href="#"
                                aria-label="Facebook"
                                icon={<Text>📘</Text>}
                                variant="ghost"
                                borderRadius="full"
                                bg={useColorModeValue('white', 'gray.800')}
                                _hover={{ bg: 'primary.500', color: 'brand.dark' }}
                            />
                            <IconButton
                                as="a"
                                href="#"
                                aria-label="Instagram"
                                icon={<Text>📷</Text>}
                                variant="ghost"
                                borderRadius="full"
                                bg={useColorModeValue('white', 'gray.800')}
                                _hover={{ bg: 'primary.500', color: 'brand.dark' }}
                            />
                        </HStack>
                    </VStack>

                    {/* Courses */}
                    <VStack align="start">
                        <Text fontWeight="bold" color={textColor} mb={4}>
                            Courses
                        </Text>
                        <VStack align="start" spacing={2} fontSize="sm" color={mutedColor}>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                IELTS Preparation
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                TOEIC Intensive
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Business English
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Communication
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Kids & Teens
                            </ChakraLink>
                        </VStack>
                    </VStack>

                    {/* Support */}
                    <VStack align="start">
                        <Text fontWeight="bold" color={textColor} mb={4}>
                            Support
                        </Text>
                        <VStack align="start" spacing={2} fontSize="sm" color={mutedColor}>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Student Portal
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Placement Test
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                FAQs
                            </ChakraLink>
                            <ChakraLink _hover={{ color: textColor, fontWeight: 'semibold' }}>
                                Contact Us
                            </ChakraLink>
                        </VStack>
                    </VStack>
                </SimpleGrid>

                <Box
                    borderTop="1px"
                    borderColor={borderColor}
                    pt={8}
                    textAlign="center"
                >
                    <Text fontSize="sm" color={mutedColor}>
                        © 2026 BeeEnglish Center. All rights reserved.
                    </Text>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer