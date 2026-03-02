import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { courseAPI } from "../services/courseService";

/**
 * Custom hook for managing instructor courses
 * Handles fetching, filtering, and course operations
 */
export const useInstructorCourses = (instructorId, statusFilter = "") => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [revising, setRevising] = useState(false);
    const toast = useToast();

    const fetchCourses = async () => {
        if (!instructorId) return;
        try {
            setLoading(true);
            const data = await courseAPI.getInstructorCourses(instructorId, statusFilter || null);
            setCourses(data || []);
            setSelectedCourse((prev) => {
                if (!prev && data && data.length > 0) return data[0];
                if (prev && data && data.length > 0) {
                    const updated = data.find((c) => c.courseId === prev.courseId);
                    return updated || data[0];
                }
                return prev;
            });
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to load courses",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instructorId, statusFilter]);

    // Submit course for review
    const submitForReview = async (courseId) => {
        try {
            setSubmitting(true);
            const updatedCourse = await courseAPI.submitCourseForReview(courseId);

            setCourses((prev) =>
                prev.map((c) => (c.courseId === updatedCourse.courseId ? updatedCourse : c))
            );
            setSelectedCourse(updatedCourse);

            toast({
                title: "Success",
                description: "Course submitted for review successfully",
                status: "success",
                duration: 3000,
            });

            return updatedCourse;
        } catch (error) {
            console.error("Error submitting course:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit course",
                status: "error",
                duration: 3000,
            });
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // Revise course
    const reviseCourse = async (courseId) => {
        try {
            setRevising(true);
            const updatedCourse = await courseAPI.reviseCourse(courseId);

            setCourses((prev) =>
                prev.map((c) => (c.courseId === updatedCourse.courseId ? updatedCourse : c))
            );
            setSelectedCourse(updatedCourse);

            toast({
                title: "Success",
                description: "Course status reset to draft. You can now make changes.",
                status: "success",
                duration: 3000,
            });

            return updatedCourse;
        } catch (error) {
            console.error("Error revising course:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to revise course",
                status: "error",
                duration: 3000,
            });
            throw error;
        } finally {
            setRevising(false);
        }
    };

    const createCourse = async (courseData) => {
        try {
            const newCourse = await courseAPI.createCourse(courseData);
            toast({
                title: "Success",
                description: "Course created successfully",
                status: "success",
                duration: 3000,
            });
            await fetchCourses();
            setSelectedCourse(newCourse);
            return newCourse;
        } catch (error) {
            console.error("Error creating course:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create course",
                status: "error",
                duration: 3000,
            });
            throw error;
        }
    };

    return {
        courses,
        selectedCourse,
        setSelectedCourse,
        loading,
        submitting,
        revising,
        submitForReview,
        reviseCourse,
        refetch: fetchCourses,
        createCourse,
    };
};
