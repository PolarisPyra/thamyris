import { useContext } from "react";

import { AuthContext, AuthContextValue } from "@/context-providers/auth";
import { User } from "@/utils/types";

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const useUser = (): User => {
	const { user } = useAuth();
	if (!user) {
		throw new Error("useUser must be used within an authenticated context");
	}
	return user;
};
