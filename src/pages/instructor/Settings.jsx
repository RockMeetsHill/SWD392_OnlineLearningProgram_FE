import { useEffect, useState } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    SimpleGrid,
    Text,
    Textarea,
    VStack,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import Sidebar from "../../components/instructor/Sidebar";
import { PRIMARY_COLOR } from "../../constants/instructor";
import { useAuth } from "../../context/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const emptyForm = {
    fullName: "",
    phoneNumber: "",
    bio: "",
    expertise: "",
    workEmail: "",
    workPhone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
};

const InstructorSettings = () => {
    const { user, token, refreshUser } = useAuth();
    const toast = useToast();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const mainMarginLeft = isSidebarCollapsed ? "20" : "72";

    useEffect(() => {
        const profile = user?.instructorProfile || {};
        const bankInfo = profile.bankAccountInfo || {};

        setFormData({
            fullName: user?.fullName || "",
            phoneNumber: user?.phoneNumber || "",
            bio: profile.bio || "",
            expertise: profile.expertise || "",
            workEmail: profile.workEmail || "",
            workPhone: profile.workPhone || "",
            bankName: bankInfo.bankName || "",
            accountNumber: bankInfo.accountNumber || "",
            accountName: bankInfo.accountName || "",
        });
    }, [user]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    bio: formData.bio,
                    expertise: formData.expertise,
                    workEmail: formData.workEmail,
                    workPhone: formData.workPhone,
                    bankAccountInfo: {
                        bankName: formData.bankName,
                        accountNumber: formData.accountNumber,
                        accountName: formData.accountName,
                    },
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to save settings");
            }

            await refreshUser();
            toast({
                title: "Settings saved",
                description: "Your instructor profile and payout details were updated.",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            setErrorMessage(error.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box bg={bgColor} minH="100vh">
            <Sidebar
                activeTab="settings"
                setActiveTab={() => {}}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />
            <Box ml={mainMarginLeft} minH="100vh" transition="margin-left 0.3s ease" px={{ base: 4, md: 8 }} py={8}>
                <VStack align="stretch" spacing={6}>
                    <Box>
                        <Heading size="lg" color={textColor}>
                            Instructor Settings
                        </Heading>
                        <Text color={mutedColor} mt={2}>
                            Update your public instructor profile and payout information.
                        </Text>
                    </Box>

                    {errorMessage && (
                        <Alert status="error" borderRadius="lg">
                            <AlertIcon />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <Grid templateColumns={{ base: "1fr", xl: "repeat(2, 1fr)" }} gap={6}>
                        <GridItem>
                            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={6}>
                                <VStack align="stretch" spacing={4}>
                                    <Heading size="md" color={textColor}>
                                        Profile Information
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel color={textColor}>Full name</FormLabel>
                                            <Input value={formData.fullName} onChange={(event) => handleChange("fullName", event.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel color={textColor}>Phone number</FormLabel>
                                            <Input value={formData.phoneNumber} onChange={(event) => handleChange("phoneNumber", event.target.value)} />
                                        </FormControl>
                                    </SimpleGrid>
                                    <FormControl>
                                        <FormLabel color={textColor}>Expertise</FormLabel>
                                        <Input value={formData.expertise} onChange={(event) => handleChange("expertise", event.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color={textColor}>Work email</FormLabel>
                                        <Input type="email" value={formData.workEmail} onChange={(event) => handleChange("workEmail", event.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color={textColor}>Work phone</FormLabel>
                                        <Input value={formData.workPhone} onChange={(event) => handleChange("workPhone", event.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color={textColor}>Bio</FormLabel>
                                        <Textarea rows={5} value={formData.bio} onChange={(event) => handleChange("bio", event.target.value)} />
                                    </FormControl>
                                </VStack>
                            </Box>
                        </GridItem>

                        <GridItem>
                            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={6}>
                                <VStack align="stretch" spacing={4}>
                                    <Heading size="md" color={textColor}>
                                        Payout Information
                                    </Heading>
                                    <FormControl>
                                        <FormLabel color={textColor}>Bank name</FormLabel>
                                        <Input value={formData.bankName} onChange={(event) => handleChange("bankName", event.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color={textColor}>Account number</FormLabel>
                                        <Input value={formData.accountNumber} onChange={(event) => handleChange("accountNumber", event.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color={textColor}>Account holder</FormLabel>
                                        <Input value={formData.accountName} onChange={(event) => handleChange("accountName", event.target.value)} />
                                    </FormControl>
                                    <Alert status="info" borderRadius="lg">
                                        <AlertIcon />
                                        <AlertDescription>
                                            These payout details are shared with admin settlement management.
                                        </AlertDescription>
                                    </Alert>
                                </VStack>
                            </Box>
                        </GridItem>
                    </Grid>

                    <Box>
                        <Button
                            bg={PRIMARY_COLOR}
                            color="#0A1926"
                            fontWeight="bold"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default InstructorSettings;
