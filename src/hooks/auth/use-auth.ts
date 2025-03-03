import { useContext } from "react";

import { redirect } from "react-router-dom";

import { AuthContext } from "@/context/auth-context-provider";
import { User } from "@/utils/types";

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const useUser = (): User => {
	const { user } = useAuth();
	return user || (redirect("/") as any as User);
};
