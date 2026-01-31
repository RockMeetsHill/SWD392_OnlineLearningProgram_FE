import { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data;
    };

    // Google Sign In function
    const loginWithGoogle = async () => {
        // Step 1: Open Google popup and get Firebase token
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();

        // Step 2: Send token to backend for verification
        const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Google sign-in failed");
        }

        // Step 3: Save user to state and localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data;
    };

    // Register function
    const register = async (name, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }

        return data;
    };

    // Logout function
    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
    };

    // Check if user is authenticated
    const isAuthenticated = !!user;

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;