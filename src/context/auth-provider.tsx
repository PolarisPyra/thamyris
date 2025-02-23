import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/utils";
import { useNavigate } from "react-router-dom";

interface User {
	userId: number;
	username: string;
	exp: number;
	aimeCardId: string;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean | null;
	isLoading: boolean;
	error: string;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	signup: (username: string, password: string, accessCode: string) => Promise<void>;
}

interface AuthResponse {
	authenticated: boolean;
	user?: {
		userId: number;
		username: string;
		exp: number;
		aimeCardId: string;
	};
	error?: string;
}

interface LoginResponse {
	message: string;
	userId: number;
	error?: string;
}

interface SignupResponse {
	message: string;
	userId: number;
	error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const verifyAuth = async () => {
		try {
			const response = await api.users.verify.$post();

			if (response.status === 401) {
				setUser(null);
				setIsAuthenticated(false);
				return false;
			}

			if (response.ok) {
				const rawData = await response.json();
				const isValidAuthResponse = (data: unknown): data is AuthResponse => {
					if (typeof data !== "object" || data === null) return false;
					const d = data as Record<string, unknown>;
					if (typeof d.authenticated !== "boolean") return false;
					if (d.user && typeof d.user === "object") {
						const u = d.user as Record<string, unknown>;
						return (
							typeof u.userId === "number" &&
							typeof u.username === "string" &&
							typeof u.exp === "number" &&
							typeof u.aimeCardId === "string"
						);
					}
					return true;
				};

				if (isValidAuthResponse(rawData) && rawData.authenticated && rawData.user) {
					setUser({
						userId: rawData.user.userId,
						username: rawData.user.username,
						exp: rawData.user.exp,
						aimeCardId: rawData.user.aimeCardId,
					});
					setIsAuthenticated(true);
					return true;
				}
			}

			setUser(null);
			setIsAuthenticated(false);
			return false;
		} catch (err) {
			console.error("Auth verification error:", err);
			setUser(null);
			setIsAuthenticated(false);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated === null) {
			verifyAuth();
		}
	}, [isAuthenticated]);

	const login = async (username: string, password: string) => {
		setIsLoading(true);
		setError("");

		try {
			const response = await api.users.login.$post({
				json: { username, password },
			});

			if (response.ok) {
				const isVerified = await verifyAuth();
				if (isVerified) {
					navigate("/overview");
				} else {
					setError("Authentication failed after login");
				}
			} else {
				const data = await response.json();
				setError((data as LoginResponse).error || "Login failed. Please check your credentials.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (username: string, password: string, accessCode: string) => {
		setIsLoading(true);
		setError("");

		try {
			const response = await api.users.signup.$post({
				json: { username, password, accessCode },
			});

			if (response.ok) {
				const isVerified = await verifyAuth();
				if (isVerified) {
					navigate("/overview");
				} else {
					setError("Authentication failed after signup");
				}
			} else {
				const data = await response.json();
				setError((data as SignupResponse).error || "Signup failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			const response = await api.users.logout.$post();
			if (response.ok) {
				setUser(null);
				setIsAuthenticated(false);
				navigate("/login");
			}
		} catch (err) {
			console.error("Logout error:", err);
		}
	};

	const value = {
		user,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		signup,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
