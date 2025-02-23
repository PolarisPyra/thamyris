import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils";
import { avatarData, currentAvatarParts } from "@/utils/types";

interface AvatarPartsResponse {
	results: {
		id: string;
		name: string;
		avatarAccessoryId: string;
		category: string;
		version: string;
		iconPath: string;
		texturePath: string;
	}[];
	error?: string;
}

interface CurrentAvatarResponse {
	results: currentAvatarParts[];
	error?: string;
}

interface AvatarParts {
	head: number;
	face: number;
	back: number;
	wear: number;
	item: number;
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

// Fetch available parts for a specific category
export function useAvatarParts(category: number) {
	return useQuery({
		queryKey: ["avatar", "parts", category],
		queryFn: async () => {
			const response = await api.chunithm.avatar.parts[":category"].$get({
				param: { category: category.toString() },
			});
			const data = (await response.json()) as AvatarPartsResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results.map((item) => ({
				image: item.texturePath?.replace(".dds", "") || "",
				label: item.name,
				avatarAccessoryId: Number(item.avatarAccessoryId),
			}));
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
	const categories = [
		{ id: 1, key: "wear" },
		{ id: 2, key: "head" },
		{ id: 3, key: "face" },
		{ id: 5, key: "item" },
		{ id: 7, key: "back" },
	];

	const results = categories.map((category) => {
		const { data, isLoading, error } = useAvatarParts(category.id);
		return {
			key: category.key,
			data,
			isLoading,
			error,
		};
	});

	const isLoading = results.some((result) => result.isLoading);
	const error = results.find((result) => result.error)?.error;

	const data = results.reduce((acc, { key, data }) => {
		acc[key as keyof typeof acc] = data || [];
		return acc;
	}, {} as Record<string, avatarData[]>);

	return {
		data,
		isLoading,
		error,
	};
}
