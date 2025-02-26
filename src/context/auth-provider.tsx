import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { InferResponseType } from "hono";
import { useNavigate } from "react-router-dom";

import { api } from "@/utils";

type User = InferResponseType<typeof api.users.verify.$post>["user"];

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean | null;
	isLoading: boolean;
	error: string;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	signup: (username: string, password: string, accessCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// NOTE:
	//  Is isAuthenticated necessary if we can check for null user?
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const verifyAuth = async (): Promise<boolean> => {
		try {
			// NOTE:
			//  Handling the different responses (ok, error, etc.)
			//  feels like junk. Could wrap these to auto-throw on error,
			//  then just implement happy path inside try, and catch for error.
			const res = await api.users.verify.$post();
			if (!res.ok) {
				throw new Error("Invalid token");
			}

			const { user } = await res.json();
			setUser(user);
			setIsAuthenticated(true);
			return true;
		} catch (err) {
			setUser(null);
			setIsAuthenticated(false);

			// Don't set error if we're checking for the first time
			if (isAuthenticated !== null) {
				setError(err instanceof Error ? err.message : "Authentication failed");
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// Attempt to verify auth on initial load to allow for auto-login
	useEffect(() => {
		verifyAuth();
	}, []);

	useEffect(() => {
		console.error("Auth verification error:", error);
	}, [error]);

	const login = useCallback(async (username: string, password: string): Promise<void> => {
		setIsLoading(true);
		setError("");

		try {
			const res = await api.login.$post({
				json: { username, password },
			});
			if (!res.ok) {
				throw new Error("Invalid credentials");
			}
			const isVerified = await verifyAuth();
			if (isVerified) {
				navigate("/overview");
			} else {
				setError("Authentication failed after login");
			}
		} catch (err) {
			// NOTE:
			//  Maybe a resolveErrorMessage or something to handle coalescing
			setError(`Login failed: ${err instanceof Error ? err.message : "An unexpected error occurred"}`);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signup = useCallback(async (username: string, password: string, accessCode: string) => {
		setIsLoading(true);
		setError("");

		try {
			const response = await api.signup.$post({
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
				setError(data.error || "Signup failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await api.users.logout.$post();
			if (response.ok) {
				setUser(null);
				setIsAuthenticated(false);
				navigate("");
			}
		} catch (err) {
			console.error("Logout error:", err);
			setError(err instanceof Error ? err.message : "Logout failed");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// NOTE:
	//  Potentially can pull out isLoading and error from value,
	//  and put in a separate context for global loading/error handling.
	//  Then this context can just be for the user (assuming isAuthenticated is unnecessary).
	const value = useMemo(
		() => ({
			user,
			isAuthenticated,
			isLoading,
			error,
			login,
			logout,
			signup,
		}),
		[user, isAuthenticated, isLoading, error]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
