import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const SignUpSuccess = () => {
  const textMain = useColorModeValue("brand.dark", "white");
  const muted = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const logoColor = useColorModeValue("brand.dark", "primary.500");

  return (
    <Box minH="100vh" bg="transparent" color={textMain} fontFamily="body">
      {/* Honeycomb overlay */}
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        opacity={useColorModeValue(0.08, 0.12)}
        bgSize="40px 40px"
        bgPosition="0 0, 20px 20px"
        zIndex={0}
      />

      <Box position="relative" zIndex={1} minH="100vh" display="flex" flexDirection="column">
        {/* Header */}
        <Box py={8}>
          <HStack justify="center" spacing={2}>
            <Text fontSize="3xl" fontFamily="'Pacifico', cursive" color={logoColor}>
              BeeEnglish
            </Text>
            <Text fontSize="3xl">🐝</Text>
          </HStack>
        </Box>

        {/* Content */}
        <Flex flex="1" align="center" justify="center" px={4} pb={12}>
          <Container maxW="640px">
            <VStack spacing={8}>
              {/* Illustration */}
              <Box position="relative" w={{ base: "240px", md: "320px" }} h={{ base: "240px", md: "320px" }}>
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-tr, primary.500, transparent)"
                  opacity={0.2}
                  filter="blur(40px)"
                  borderRadius="full"
                />
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4xRdbxF7cUY3RNOVUH7Gs8zEdYnyRGOrKz7jdNgr0m8MnymdG4-aXGLDnDffC2vqmeVI3HGdjcl4DUaWrkGopD_oZc8fMmmSWQsePPbCwvvFYZ1-Am97DkUDaYdAJ27FhrUAUm6j54G4zNaNJ2JvoBEvRvw7gu8VUe8rs5N1sBse10PWwOBDZNgvKuA3zBFkLPyF5c7O4_javkYF-Qt01C5X61RdGURIoDpgfWZF_TKvSYp1pDkrOg3iBDzbzLZhx_X_RtPpr4g"
                  alt="Bee illustration"
                  w="full"
                  h="full"
                  objectFit="contain"
                  position="relative"
                  zIndex={1}
                />
              </Box>

              <VStack spacing={3} textAlign="center">
                <Heading size="lg">Welcome to BeeEnglish!</Heading>
                <Text color={muted} fontSize="lg" maxW="480px">
                  Your student account has been successfully created. Ready to start your English journey?
                </Text>
              </VStack>

              <Stack direction={{ base: "column", sm: "row" }} spacing={4} w="full" maxW="480px">
                <Button
                  flex="1"
                  bg="primary.500"
                  color="brand.dark"
                  h={14}
                  fontWeight="bold"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{ bg: "primary.600" }}
                  boxShadow="md"
                  as={Link}
                  to="/student/dashboard"
                >
                  Go to Dashboard
                </Button>

                <Button
                  flex="1"
                  variant="outline"
                  h={14}
                  fontWeight="bold"
                  border="2px solid"
                  borderColor={borderColor}
                  _hover={{ bg: useColorModeValue("blackAlpha.50", "whiteAlpha.100") }}
                  as={Link}
                  to="/courses"
                >
                  Browse Courses
                </Button>
              </Stack>
            </VStack>
          </Container>
        </Flex>
      </Box>
    </Box>
  );
};

export default SignUpSuccess;