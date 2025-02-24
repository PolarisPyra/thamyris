import { api } from "@/utils";
import { useQuery } from "@tanstack/react-query";

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

			if (data.error) {
				throw new Error(data.error);
			}

			return data.username;
		},
	});
}
