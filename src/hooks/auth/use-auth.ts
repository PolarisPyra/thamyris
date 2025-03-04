import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/auth-context";
import { User } from "@/utils/types";

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

/**
 * This hook guarantees a user object, or else it will redirect to the home page.
 * This means you can expand the returned object directly:
 *
 * const { username, email } = useUser();
 *
 */
export const useUser = (): User => {
	const { user } = useAuth();
	const navigate = useNavigate();
	return user || (navigate("") as any as User);
};
