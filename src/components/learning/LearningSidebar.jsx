import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Collapse,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

const LearningSidebar = ({ course, selectedLessonId, lessonStatusMap = {}, onSetLesson, primaryColor = "#DAA520" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const handleReturnToDashboard = () => {
    navigate("/student/dashboard");
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <Box
      w={isCollapsed ? "80px" : "280px"}
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      position="sticky"
      top={0}
      left={0}
      overflowY="auto"
      overflowX="auto"
      transition="all 0.3s ease"
    >
      <VStack spacing={4} align="stretch" px={4}>
        {/* Header with Toggle Button */}
        <Flex justify="right" align="right">
          <Tooltip
            label={isCollapsed ? "Expand" : "Collapse"}
            placement="right"
            openDelay={500}
          >
            <IconButton
              icon={
                isCollapsed ? (
                  <ChevronRightIcon boxSize={5} />
                ) : (
                  <ChevronLeftIcon boxSize={5} />
                )
              }
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              color={textColor}
              _hover={{ bg: hoverBg }}
            />
          </Tooltip>
        </Flex>

        <Divider />

        {/* Return to Dashboard Button */}
        {!isCollapsed && (
          <>
            <Tooltip
              label="Return to Dashboard"
              placement="right"
              isDisabled={!isCollapsed}
              openDelay={500}
            >
              <Button
                leftIcon={<ArrowBackIcon />}
                onClick={handleReturnToDashboard}
                bg="primary.500"
                color="brand.dark"
                fontWeight="bold"
                rounded="lg"
                w="full"
                size="sm"
                transition="all 0.2s"
                _hover={{
                  bg: "primary.400",
                  transform: "translateX(-2px)",
                }}
                justifyContent="flex-start"
                px={3}
              >
                Return
              </Button>
            </Tooltip>

            <Divider />
          </>
        )}

        {/* Course Content - Modules and Lessons */}
        {!isCollapsed && course?.modules && (
          <VStack align="stretch" spacing={2} flex={1} overflowY="auto">
            <Text fontWeight="bold" color={textColor} fontSize="xs" px={2}>
              COURSE CONTENT
            </Text>
            <VStack align="stretch" spacing={1}>
              {course.modules.map((mod) => {
                const isExpanded = expandedModules[mod.moduleId] !== false;
                const lessons = mod.lessons || [];
                return (
                  <Box key={mod.moduleId}>
                    <Flex
                      align="center"
                      justify="space-between"
                      py={2}
                      px={2}
                      cursor="pointer"
                      borderRadius="md"
                      _hover={{ bg: hoverBg }}
                      onClick={() => toggleModule(mod.moduleId)}
                    >
                      <Text fontSize="xs" fontWeight="medium" color={textColor} noOfLines={1}>
                        {mod.title}
                      </Text>
                      {isExpanded ? (
                        <ChevronDownIcon boxSize={3} color={mutedColor} />
                      ) : (
                        <ChevronRightIcon boxSize={3} color={mutedColor} />
                      )}
                    </Flex>
                    <Collapse in={isExpanded}>
                      <VStack align="stretch" spacing={0} pl={2}>
                        {lessons.map((lesson) => (
                          <Button
                            key={lesson.lessonId}
                            size="xs"
                            variant="ghost"
                            justifyContent="flex-start"
                            fontWeight={selectedLessonId === lesson.lessonId ? "bold" : "normal"}
                            color={selectedLessonId === lesson.lessonId ? primaryColor : textColor}
                            bg={selectedLessonId === lesson.lessonId ? `${primaryColor}20` : "transparent"}
                            onClick={() => onSetLesson && onSetLesson(lesson.lessonId)}
                            fontSize="xs"
                            _hover={{
                              bg: `${primaryColor}15`,
                            }}
                            title={lesson.title}
                          >
                            {lessonStatusMap[lesson.lessonId] === "completed" ? "✓ " : ""}
                            {lesson.title}
                          </Button>
                        ))}
                      </VStack>
                    </Collapse>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default LearningSidebar;
