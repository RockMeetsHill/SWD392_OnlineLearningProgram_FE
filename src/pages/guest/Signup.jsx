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
import { useState } from "react";
import GoogleLogo from "../../assets/login_icons/google_logo_icon.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bgCard = useColorModeValue("white", "#112233");
  const textMain = useColorModeValue("brand.dark", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const logoColor = useColorModeValue("brand.dark", "primary.500");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms of Service and Privacy Policy",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Success",
        description: "Account created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/register/success");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="full"
      bg={"transparent"}
      overflowX="hidden"
      position="relative"
      py={10}
      px={4}
      color={textMain}
      fontFamily="body"
    >
      {/* Glow blobs */}
      <Box
        position="fixed"
        top="-10%"
        left="-10%"
        w="400px"
        h="400px"
        bg="primary.500"
        opacity={0.2}
        borderRadius="full"
        filter="blur(120px)"
        pointerEvents="none"
        zIndex={0}
      />
      <Box
        position="fixed"
        bottom="-10%"
        right="-10%"
        w="300px"
        h="300px"
        bg="primary.500"
        opacity={0.2}
        borderRadius="full"
        filter="blur(100px)"
        pointerEvents="none"
        zIndex={0}
      />

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
            bg={bgCard}
            borderRadius="2xl"
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
            p={{ base: 8, sm: 10 }}
          >
            <form onSubmit={handleRegister}>
              <VStack align="stretch" spacing={6}>
                <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                  <Heading size="lg">Create your account</Heading>
                  <Text color={textMuted}>Start your learning journey today</Text>
                </VStack>

                <Stack spacing={5}>
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mb={2}
                      align="left"
                    >
                      Full Name
                    </Text>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      h={12}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2} align="left">
                      Email
                    </Text>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      type="email"
                      h={12}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2} align="left">
                      Password
                    </Text>
                    <Flex align="center" position="relative">
                      <Input
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min. 8 characters"
                        type={showPassword ? "text" : "password"}
                        h={12}
                        pr={12}
                      />
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        position="absolute"
                        right={2}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </Flex>
                  </Box>

                  <Checkbox
                    colorScheme="yellow"
                    isChecked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  >
                    <Text fontSize="sm" color={textMuted}>
                      I agree to the{" "}
                      <Box as="span" textDecoration="underline">
                        Terms of Service
                      </Box>{" "}
                      and{" "}
                      <Box as="span" textDecoration="underline">
                        Privacy Policy
                      </Box>
                      .
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
                    loadingText="Creating Account..."
                  >
                    Create Account
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
                    Sign up with Google
                  </Button>
                </Stack>

                <HStack
                  justify="center"
                  pt={4}
                  borderTop="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontSize="sm" color={textMuted}>
                    Already have an account?
                  </Text>
                  <Link to="/login">
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="brand.dark"
                      textDecoration="underline"
                    >
                      Log in
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

export default Signup;
