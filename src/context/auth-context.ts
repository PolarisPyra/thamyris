import { createContext } from "react";

import type { InferResponseType } from "hono";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
