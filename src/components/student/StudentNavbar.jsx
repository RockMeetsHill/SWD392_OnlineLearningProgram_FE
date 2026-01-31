import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    InputGroup,
    InputLeftElement,
    Input,
    IconButton,
    Avatar,
    useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon, BellIcon } from '@chakra-ui/icons'

const StudentNavbar = () => {
    const bgColor = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    // TODO: Replace with actual user data from context/auth
    const user = {
        name: 'Alex Johnson',
        role: 'IELTS Student',
        avatar: 'https://bit.ly/broken-link',
    }

    return (
        <Box
            bg={bgColor}
            borderBottom="1px"
            borderColor={borderColor}
            px={8}
            py={4}
            position="sticky"
            top={0}
            zIndex={10}
            backdropFilter="blur(12px)"
        >
            <Flex justify="space-between" align="center">
                {/* Search Bar */}
                <InputGroup maxW="500px">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search for lessons, quizzes, resources..."
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        border="none"
                        rounded="lg"
                    />
                </InputGroup>

                {/* User Actions */}
                <HStack spacing={4}>
                    <IconButton
                        icon={<BellIcon />}
                        rounded="full"
                        variant="ghost"
                        aria-label="Notifications"
                        position="relative"
                    />
                    <VStack spacing={0} align="end">
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                            {user.name}
                        </Text>
                        <Text fontSize="xs" color={mutedColor}>
                            {user.role}
                        </Text>
                    </VStack>
                    <Avatar
                        size="sm"
                        name={user.name}
                        src={user.avatar}
                    />
                </HStack>
            </Flex>
        </Box>
    )
}

export default StudentNavbar