import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useArcades() {
	return useQuery({
		queryKey: ["arcades"],
		queryFn: async () => {
			const response = await api.arcades.list.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const response = await api.arcades.users.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
export function useUpdateArcadeOwnership() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ arcade, user }: { arcade: number; user: number }) => {
			const response = await api.arcades.update.$post({
				json: {
					arcade,
					user,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to update nameplate");
			}
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentNameplate"] });
		},
	});
}
