import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLoading } from "@/hooks/loading/loading";
import { api } from "@/utils";
import { User } from "@/utils/types";

import { AuthContext } from "./auth-context";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<User>();
	const { setIsLoading } = useLoading();

	const verify = useCallback(() => {
		api.users.verify
			.$post()
			.then((res) => res.json())
			.then((data) => setUser(data.user))
			.then(() => navigate("/overview"))
			.catch((error) => toast.error("Authentication failed:", error));
	}, []);

	useEffect(() => {
		verify();
	}, [verify]);

	const login = useCallback((username: string, password: string) => {
		setIsLoading(true);
		api.login
			.$post({ json: { username, password } })
			.then((res) => res.json())
			.then(({ user }) => setUser(user))
			.catch((error) => toast.error("Login failed:", error))
			.finally(() => setIsLoading(false));
	}, []);

	const logout = useCallback(() => {
		setIsLoading(true);
		api.users.logout
			.$post()
			.then(() => setUser(undefined))
			.catch((error) => toast.error("Logout failed:", error))
			.finally(() => setIsLoading(false));
	}, []);

	const signup = useCallback((username: string, password: string, accessCode: string) => {
		api.signup
			.$post({ json: { username, password, accessCode } })
			.then((res) => res.json())
			.then((data) => setUser(data.user))
			.catch((error) => toast.error("Signup failed:", error))
			.finally(() => setIsLoading(false));
	}, []);

	return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>;
};
