import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast, Flex, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

/**
 * Protects routes by role. Redirects to login if not authenticated,
 * or to home/student dashboard if authenticated but role not allowed.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();
    const toast = useToast();

    const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.some((role) => hasRole(role));

    useEffect(() => {
        if (!isLoading && isAuthenticated && !hasAllowedRole && allowedRoles.length > 0) {
            toast({
                title: "Access denied",
                description: "You do not have permission to view this page.",
                status: "warning",
                duration: 3000,
            });
        }
    }, [isLoading, isAuthenticated, hasAllowedRole, allowedRoles.length, toast]);

    if (isLoading) {
        return (
            <Flex minH="50vh" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasAllowedRole) {
        return <Navigate to={user?.roles?.includes("student") ? "/student/dashboard" : "/"} replace />;
    }

    return children;
};

export default ProtectedRoute;
