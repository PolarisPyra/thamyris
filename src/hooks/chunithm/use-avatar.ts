import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AvatarParts } from "@/types";
import { api } from "@/utils";

// Fetch current avatar
export function useCurrentAvatar() {
	return useQuery({
		queryKey: ["avatar", "current"],
		queryFn: async () => {
			const response = await api.chunithm.avatar.current.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
// Update avatar mutation
export function useUpdateAvatar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (avatarParts: AvatarParts) => {
			const response = await api.chunithm.avatar.update.$post({
				json: {
					...avatarParts,
				},
			});

			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["avatar", "current"] });
		},
	});
}

// Hook to fetch all avatar parts
export function useAllAvatarParts() {
	return useQuery({
		queryKey: ["avatar", "parts", "all"],
		queryFn: async () => {
			const response = await api.chunithm.avatar.parts.all.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
