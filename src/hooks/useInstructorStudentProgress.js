import { useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { courseAPI } from "../services/courseService";
import { instructorProgressAPI } from "../services/instructorProgressService";

export const useInstructorStudentProgress = (instructorId) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [progressData, setProgressData] = useState(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (!instructorId) return;
        let cancelled = false;

        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const data = await courseAPI.getInstructorCourses(instructorId);
                if (cancelled) return;
                const normalized = Array.isArray(data) ? data : [];
                const firstCourseWithStudents =
                    normalized.find((course) => Number(course.totalStudents || 0) > 0) || null;
                setCourses(normalized);
                setSelectedCourseId((prev) => {
                    if (prev && normalized.some((course) => String(course.courseId) === String(prev))) {
                        return prev;
                    }
                    return firstCourseWithStudents?.courseId
                        ? String(firstCourseWithStudents.courseId)
                        : normalized[0]?.courseId
                            ? String(normalized[0].courseId)
                            : "";
                });
            } catch (error) {
                if (!cancelled) {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to load instructor courses",
                        status: "error",
                        duration: 3000,
                    });
                }
            } finally {
                if (!cancelled) setLoadingCourses(false);
            }
        };

        fetchCourses();
        return () => {
            cancelled = true;
        };
    }, [instructorId, toast]);

    const fetchProgress = async (courseId = selectedCourseId) => {
        if (!courseId) {
            setProgressData(null);
            return;
        }

        try {
            setLoadingProgress(true);
            const data = await instructorProgressAPI.getCourseStudentsProgress(courseId);
            setProgressData(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to load student progress",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoadingProgress(false);
        }
    };

    useEffect(() => {
        fetchProgress(selectedCourseId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourseId]);

    const selectedCourse = useMemo(
        () => courses.find((course) => String(course.courseId) === String(selectedCourseId)) || null,
        [courses, selectedCourseId]
    );

    return {
        courses,
        selectedCourse,
        selectedCourseId,
        setSelectedCourseId,
        progressData,
        loadingCourses,
        loadingProgress,
        refetchProgress: fetchProgress,
    };
};
