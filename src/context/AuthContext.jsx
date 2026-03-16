import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AuthProvider({ children }) {
    // Khởi tạo state từ localStorage ngay lập tức (không chờ useEffect)
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async (overrideToken = token) => {
        if (!overrideToken) {
            setUser(null);
            localStorage.removeItem("user");
            return null;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${overrideToken}`,
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            const userData = data.user || data;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            return userData;
        }

        if (response.status === 401) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return null;
        }

        throw new Error("Failed to refresh user");
    };

    // Verify token on mount
    useEffect(() => {
        let isMounted = true;

        const verifyAuth = async () => {
            if (token) {
                try {
                    if (!isMounted) return;
                    await refreshUser(token);
                } catch (error) {
                    console.error("Auth verification error:", error);
                }
            }

            if (isMounted) {
                setIsLoading(false);
            }
        };

        verifyAuth();

        return () => {
            isMounted = false;
        };
    }, [token]);

    // Sync giữa các tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "user") {
                if (e.newValue) {
                    try {
                        setUser(JSON.parse(e.newValue));
                    } catch {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            if (e.key === "token") {
                setToken(e.newValue);
            }
        };

        globalThis.addEventListener("storage", handleStorageChange);
        return () => globalThis.removeEventListener("storage", handleStorageChange);
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
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        await refreshUser(data.token);

        return data;
    };

    // Google Sign In function
    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();

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

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        await refreshUser(data.token);

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
    };

    const isAuthenticated = !!user && !!token;

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        loginWithGoogle,
        register,
        logout,
        hasRole,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export { AuthContext, AuthProvider, useAuth };