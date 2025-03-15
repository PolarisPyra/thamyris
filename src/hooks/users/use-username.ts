import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface UserResponse {
	username: string;
	error?: string;
}
// Fetch username
export function useUsername() {
	return useQuery({
		queryKey: ["username"],
		queryFn: async () => {
			const response = await api.users.username.$get();
			const data = (await response.json()) as UserResponse;
			if (!response.ok) {
				throw new Error();
			}

			return data.username;
		},
	});
}
