import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { InferResponseType } from "hono";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/auth-context";
import { api } from "@/utils";

type User = InferResponseType<typeof api.users.verify.$post>["user"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const verifyAuth = useCallback(async (): Promise<boolean> => {
		try {
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

			if (isAuthenticated !== null) {
				setError(err instanceof Error ? err.message : "Authentication failed");
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

	const login = useCallback(
		async (username: string, password: string): Promise<void> => {
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
				setError(`Login failed: ${err instanceof Error ? err.message : "An unexpected error occurred"}`);
			} finally {
				setIsLoading(false);
			}
		},
		[navigate, verifyAuth]
	);

	const signup = useCallback(
		async (username: string, password: string, accessCode: string) => {
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
		},
		[navigate, verifyAuth]
	);

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
	}, [navigate]);

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
		[user, isAuthenticated, isLoading, error, login, logout, signup]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
