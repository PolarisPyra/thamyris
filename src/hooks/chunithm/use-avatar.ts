import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AvatarParts } from "@/types/types";
import { api } from "@/utils";

interface CurrentAvatarResponse {
	results: AvatarParts[];
	error?: string;
}

interface AllAvatarPartsResponse {
	results?: Record<string, AvatarParts[]>;
	error?: string;
}

// Fetch current avatar
export function useCurrentAvatar() {
	return useQuery({
		queryKey: ["avatar", "current"],
		queryFn: async () => {
			const response = await api.chunithm.avatar.current.$get();
			const data = (await response.json()) as CurrentAvatarResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			const avatar = data.results[0];
			return {
				head: avatar.avatarHeadTexture?.replace(".dds", "") || "",
				back: avatar.avatarBackTexture?.replace(".dds", "") || "",
				wear: avatar.avatarWearTexture?.replace(".dds", "") || "",
				face: avatar.avatarFaceTexture?.replace(".dds", "") || "",
				item: avatar.avatarItemTexture?.replace(".dds", "") || "",
			};
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
					avatarParts,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to update avatar");
			}

			return response;
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
			const data = (await response.json()) as AllAvatarPartsResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results || {};
		},
	});
}
