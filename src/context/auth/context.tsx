import { createContext } from "react";

import { User } from "@/types";

export interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	error: string;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (user: User | null) => void;
	signup: (username: string, password: string, accessCode: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);
