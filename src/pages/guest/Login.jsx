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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "../../assets/login_icons/google_logo_icon.png";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const bgCard = useColorModeValue("white", "#112233");
  const textMain = useColorModeValue("brand.dark", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const logoColor = useColorModeValue("brand.dark", "primary.500");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email, password);

      toast({
        title: "Success",
        description: "Login successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on role
      redirectBasedOnRole(data.user.roles);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const data = await loginWithGoogle();

      toast({
        title: "Success",
        description: "Google sign-in successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on role
      redirectBasedOnRole(data.user.roles);
    } catch (error) {
      // Handle specific Firebase errors
      let errorMessage = "Google sign-in failed";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in cancelled";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups for this site.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Google Sign-in Failed",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const redirectBasedOnRole = (roles) => {
    if (roles.includes("admin")) {
      navigate("/admin/dashboard");
    } else if (roles.includes("instructor")) {
      navigate("/instructor/dashboard");
    } else {
      navigate("/");
    }
  };

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
            <form onSubmit={handleLogin}>
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
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      h={12}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isDisabled={isLoading || isGoogleLoading}
                    />
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isDisabled={isLoading || isGoogleLoading}
                      />
                      <IconButton
                        aria-label="Toggle password"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        position="absolute"
                        right={2}
                        onClick={() => setShowPassword((v) => !v)}
                      />
                    </Flex>
                  </Box>

                  <Checkbox
                    colorScheme="yellow"
                    isChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    <Text fontSize="sm" color={textMuted}>
                      Remember me
                    </Text>
                  </Checkbox>

                  <Button
                    type="submit"
                    bg="primary.500"
                    color="brand.dark"
                    h={14}
                    fontWeight="bold"
                    _hover={{ bg: "primary.600" }}
                    boxShadow="lg"
                    isLoading={isLoading}
                    isDisabled={isGoogleLoading}
                    loadingText="Signing in..."
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
                    onClick={handleGoogleLogin}
                    isLoading={isGoogleLoading}
                    isDisabled={isLoading}
                    loadingText="Signing in with Google..."
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
            </form>
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