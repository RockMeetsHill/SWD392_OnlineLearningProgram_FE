import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import GoogleLogo from "../../assets/login_icons/google_logo_icon.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const bgCard = useColorModeValue("white", "#112233");
  const textMain = useColorModeValue("brand.dark", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const logoColor = useColorModeValue("brand.dark", "primary.500");

  return (
    <Box
      minH="100vh"
      w="full"
      bg="transparent"
      overflowX="hidden"
      position="relative"
      py={10}
      px={4}
      color={textMain}
      fontFamily="body"
    >
      <Container position="relative" zIndex={1}>
        <VStack spacing={8} w="full">
          {/* Logo */}
          <VStack spacing={2}>
            <HStack spacing={2} userSelect="none">
              <Text
                fontSize="3xl"
                fontFamily="'Pacifico', cursive"
                color={logoColor}
              >
                BeeEnglish
              </Text>
              <Text fontSize="3xl" className="bee-float">
                🐝
              </Text>
            </HStack>
          </VStack>

          {/* Card */}
          <Box
            w="full"
            maxW="800px"
            mx="auto"
            bg={bgCard}
            borderRadius="2xl"
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
            p={{ base: 8, sm: 10 }}
          >
            <VStack align="stretch" spacing={6}>
              <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                <Heading size="lg">Welcome back</Heading>
                <Text color={textMuted}>
                  Please enter your details to sign in
                </Text>
              </VStack>

              <Stack spacing={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2} align="left">
                    Email
                  </Text>
                  <Input placeholder="name@example.com" type="email" h={12} />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2} align="left">
                    Password
                  </Text>
                  <Flex align="center" position="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      h={12}
                      pr={12}
                    />
                    <IconButton
                      aria-label="Show password"
                      icon={<ViewIcon />}
                      variant="ghost"
                      position="absolute"
                      right={2}
                      onClick={() => setShowPassword((v) => !v)}
                    />
                  </Flex>
                </Box>

                <Checkbox colorScheme="yellow">
                  <Text fontSize="sm" color={textMuted}>
                    Remember me
                  </Text>
                </Checkbox>

                <Button
                  bg="primary.500"
                  color="brand.dark"
                  h={14}
                  fontWeight="bold"
                  _hover={{ bg: "primary.600" }}
                  boxShadow="lg"
                >
                  Sign In
                </Button>

                <HStack spacing={4}>
                  <Box
                    h="1px"
                    flex="1"
                    bg={useColorModeValue("gray.200", "gray.700")}
                  />
                  <Text fontSize="sm" color="gray.400" fontWeight="medium">
                    OR
                  </Text>
                  <Box
                    h="1px"
                    flex="1"
                    bg={useColorModeValue("gray.200", "gray.700")}
                  />
                </HStack>

                <Button
                  variant="outline"
                  h={14}
                  fontWeight="bold"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  leftIcon={
                    <Box
                      as="img"
                      src={GoogleLogo}
                      alt="Google"
                      w="20px"
                      h="20px"
                    />
                  }
                >
                  Sign in with Google
                </Button>
              </Stack>

              <HStack
                justify="center"
                pt={4}
                borderTop="1px solid"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={textMuted}>
                  Don't have an account?
                </Text>
                <Link to="/register">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="brand.dark"
                    textDecoration="underline"
                  >
                    Sign up
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: .2; }
          50% { transform: scale(1.05); opacity: .35; }
        }
      `}</style>
    </Box>
  );
};

export default Login;
