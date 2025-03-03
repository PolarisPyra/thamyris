import { createContext } from "react";

import { User } from "@/utils/types";

export type AuthContextValue = {
	login: (username: string, password: string) => void;
	logout: () => void;
	signup: (username: string, password: string, accessCode: string) => void;
	user?: User;
};

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);
