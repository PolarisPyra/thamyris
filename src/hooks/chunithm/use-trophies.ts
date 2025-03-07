import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Trophy {
	id: number;
	name: string;
	description: string;
	rareType: number;
	trophyId: number;
}

interface CurrentTrophyResponse {
	success: boolean;
	data?: {
		trophyId: number | null;
		trophyIdSub1: number | null;
		trophyIdSub2: number | null;
		version: number;
	};
	error?: string;
}

interface UnlockedTrophyResponse {
	success: boolean;
	data?: Trophy[];
	error?: string;
}

interface UpdateTrophyResponse {
	success: boolean;
	error?: string;
}

// Fetch unlocked trophies
export function useUnlockedTrophies() {
	return useQuery({
		queryKey: ["unlockedTrophies"],
		queryFn: async () => {
			const response = await api.chunithm.trophies.unlocked.$get();
			const data = (await response.json()) as UnlockedTrophyResponse;

			if (!data.success || data.error) {
				throw new Error(data.error || "Failed to fetch unlocked trophies");
			}

			return data.data || [];
		},
	});
}

// Fetch current trophy
export function useCurrentTrophy() {
	return useQuery({
		queryKey: ["currentTrophy"],
		queryFn: async () => {
			const response = await api.chunithm.trophies.current.$get();
			const data = (await response.json()) as CurrentTrophyResponse;

			if (!data.success || data.error) {
				throw new Error(data.error || "Failed to fetch current trophy");
			}

			return data.data || null;
		},
	});
}

// Update trophy mutation
export function useUpdateTrophy() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			mainTrophyId,
			subTrophy1Id,
			subTrophy2Id,
		}: {
			mainTrophyId?: number;
			subTrophy1Id?: number;
			subTrophy2Id?: number;
		}) => {
			const response = await api.chunithm.trophies.update.$post({
				json: { mainTrophyId, subTrophy1Id, subTrophy2Id },
			});
			const data = (await response.json()) as UpdateTrophyResponse;

			if (!data.success || data.error) {
				throw new Error(data.error || "Failed to update trophy");
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentTrophy"] });
		},
	});
}
