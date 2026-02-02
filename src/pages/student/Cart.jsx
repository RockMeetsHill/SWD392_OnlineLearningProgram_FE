import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    HStack,
    VStack,
    Card,
    CardBody,
    Image,
    Badge,
    useColorModeValue,
    Flex,
    Divider,
    IconButton,
    Spinner,
    Center,
    useToast,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { DeleteIcon} from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentNavbar from '../../components/student/StudentNavbar'
import Sidebar from '../../components/student/StudentSidebar'
import { useAuth } from '../../context/AuthContext'

const Cart = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    // Color mode values
    const bgColor = useColorModeValue('#f8f8f5', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const borderColor = useColorModeValue('gray.100', 'gray.700')

    // States
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch cart items from localStorage
    useEffect(() => {
        console.log('[Cart] Loading cart from localStorage')
        
        try {
            const localCartItems = localStorage.getItem("cartItems")
            console.log('[Cart] Retrieved from localStorage:', localCartItems)
            
            if (localCartItems) {
                const parsed = JSON.parse(localCartItems)
                console.log('[Cart] Parsed cart items:', parsed)
                setCartItems(parsed)
            } else {
                console.log('[Cart] No items in localStorage')
                setCartItems([])
            }
        } catch (error) {
            console.error('[Cart] Error loading cart from localStorage:', error)
            setCartItems([])
        } finally {
            setLoading(false)
            console.log('[Cart] Cart loading completed')
        }
    }, [])



    // Remove item from cart in localStorage
    const removeItem = (itemId) => {
        console.log('[Cart] Removing item:', itemId)
        console.log('[Cart] Current cart items before removal:', cartItems)
        
        try {
            const updatedItems = cartItems.filter((item) => item.id !== itemId)
            console.log('[Cart] Updated items after removal:', updatedItems)
            setCartItems(updatedItems)
            // Save to localStorage
            localStorage.setItem("cartItems", JSON.stringify(updatedItems))
            console.log('[Cart] Item removal saved to localStorage')
            toast({
                title: 'Removed',
                description: 'Item removed from cart',
                status: 'success',
                duration: 2,
                isClosable: true,
            })
        } catch (error) {
            console.error('[Cart] Error removing item:', error)
            toast({
                title: 'Error',
                description: 'Failed to remove item',
                status: 'error',
                duration: 3,
                isClosable: true,
            })
        }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    const total = subtotal
    
    // Debug log for cart state changes
    console.log('[Cart] Current cart items:', cartItems)
    console.log('[Cart] Subtotal:', subtotal)
    console.log('[Cart] Total:', total)

    return (
        <Flex minH="100vh" bg={bgColor}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box flex={1}>
                <StudentNavbar />

                {/* Main Content Area */}
                <Box px={8} py={6}>
                    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                        {/* Left Column - Cart Items */}
                        <GridItem colSpan={{ base: 12, lg: 8 }}>
                            <VStack spacing={6} align="stretch">
                                {/* Header */}
                                <Box>
                                    <Heading size="lg" color={textColor} mb={1}>
                                        Shopping Cart 🛒
                                    </Heading>
                                    <Text color={mutedColor}>
                                        {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
                                    </Text>
                                </Box>

                                {/* Cart Items */}
                                {loading ? (
                                    <Center py={12}>
                                        <Spinner color="primary.500" size="lg" />
                                    </Center>
                                ) : cartItems.length === 0 ? (
                                    <Card bg={cardBg} shadow="sm" rounded="2xl">
                                        <CardBody py={12}>
                                            <VStack spacing={4} align="center">
                                                <Text fontSize="4xl">🛒</Text>
                                                <Heading size="md" color={textColor}>
                                                    Your cart is empty
                                                </Heading>
                                                <Text color={mutedColor} textAlign="center">
                                                    Browse our courses and add some to get started!
                                                </Text>
                                                <Button
                                                    bg="primary.500"
                                                    color="brand.dark"
                                                    fontWeight="bold"
                                                    rounded="full"
                                                    _hover={{ bg: 'primary.600' }}
                                                    onClick={() => navigate('/courses')}
                                                >
                                                    Browse Courses
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                ) : (
                                    <VStack spacing={4} align="stretch">
                                        {cartItems.map((item) => (
                                            <Card
                                                key={item.id}
                                                bg={cardBg}
                                                shadow="sm"
                                                rounded="2xl"
                                                border="1px"
                                                borderColor={borderColor}
                                            >
                                                <CardBody>
                                                    <Flex gap={6} align="start">
                                                        {/* Course Image */}
                                                        <Box
                                                            w={{ base: '100%', md: '140px' }}
                                                            h="100px"
                                                            borderRadius="lg"
                                                            overflow="hidden"
                                                            flexShrink={0}
                                                        >
                                                            <Image
                                                                src={
                                                                    item.thumbnail ||
                                                                    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
                                                                }
                                                                alt={item.title}
                                                                w="full"
                                                                h="full"
                                                                objectFit="cover"
                                                            />
                                                        </Box>

                                                        {/* Course Info */}
                                                        <VStack
                                                            flex={1}
                                                            align="start"
                                                            spacing={3}
                                                            justify="space-between"
                                                        >
                                                            <VStack align="start" spacing={2} w="full">
                                                                <Heading size="sm" color={textColor}>
                                                                    {item.title}
                                                                </Heading>
                                                                <Text color={mutedColor} fontSize="sm">
                                                                    {item.instructor || 'Instructor name'}
                                                                </Text>
                                                                {item.badge && (
                                                                    <Badge
                                                                        bg="primary.500"
                                                                        color="brand.dark"
                                                                        fontSize="xs"
                                                                        fontWeight="bold"
                                                                        px={2}
                                                                        py={1}
                                                                        rounded="md"
                                                                    >
                                                                        {item.badge}
                                                                    </Badge>
                                                                )}
                                                            </VStack>

                                                            {/* Actions */}
                                                            <HStack spacing={4} w="full">


                                                                <Heading size="sm" color="primary.500">
                                                                    ${(parseFloat(item.price) || 0).toFixed(2)}
                                                                </Heading>

                                                                <IconButton
                                                                    icon={<DeleteIcon />}
                                                                    variant="ghost"
                                                                    colorScheme="red"
                                                                    size="sm"
                                                                    ml="auto"
                                                                    onClick={() => removeItem(item.id)}
                                                                />
                                                            </HStack>
                                                        </VStack>
                                                    </Flex>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </VStack>
                                )}
                            </VStack>
                        </GridItem>

                        {/* Right Column - Order Summary */}
                        <GridItem colSpan={{ base: 12, lg: 4 }}>
                            <VStack spacing={6} align="stretch" h="full">
                                {/* Order Summary Card */}
                                <Card bg={cardBg} shadow="sm" rounded="2xl" position="sticky" top={6}>
                                    <CardBody>
                                        <VStack spacing={6} align="stretch">
                                            <Heading size="md" color={textColor}>
                                                Order Summary
                                            </Heading>

                                            <Divider />

                                            {/* Price Breakdown */}
                                            <VStack spacing={3} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text color={mutedColor}>Subtotal</Text>
                                                    <Text color={textColor} fontWeight="bold">
                                                        ${subtotal.toFixed(2)}
                                                    </Text>
                                                </HStack>
                                            </VStack>

                                            <Divider />

                                            {/* Total */}
                                            <HStack justify="space-between">
                                                <Heading size="md" color={textColor}>
                                                    Total
                                                </Heading>
                                                <Heading size="md" color="primary.500">
                                                    ${total.toFixed(2)}
                                                </Heading>
                                            </HStack>

                                            {/* Checkout Button */}
                                            <Button
                                                w="full"
                                                bg="primary.500"
                                                color="brand.dark"
                                                fontWeight="bold"
                                                rounded="full"
                                                py={6}
                                                fontSize="md"
                                                _hover={{ bg: 'primary.600' }}
                                                isDisabled={cartItems.length === 0}
                                            >
                                                Proceed to Checkout
                                            </Button>

                                            <Button
                                                w="full"
                                                variant="outline"
                                                borderColor={borderColor}
                                                color={textColor}
                                                fontWeight="bold"
                                                rounded="full"
                                                py={6}
                                                onClick={() => navigate('/courses')}
                                            >
                                                Continue Shopping
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
        </Flex>
    )
}


export default Cart
