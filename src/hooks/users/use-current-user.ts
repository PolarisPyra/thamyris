import { User } from "@/types";

import { useAuth } from "../auth/use-auth";

export const useCurrentUser = (): User => {
	const { user } = useAuth();
	if (!user) {
		throw new Error("useUser must be used within an authenticated context");
	}
	return user;
};
