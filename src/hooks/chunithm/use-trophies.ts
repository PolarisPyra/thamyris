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
	data?: {
		trophyId: number | null;
		trophyIdSub1: number | null;
		trophyIdSub2: number | null;
		version: number;
	};
	error?: string;
}

interface UnlockedTrophyResponse {
	data?: Trophy[];
	error?: string;
}

export function useUnlockedTrophies() {
	return useQuery({
		queryKey: ["unlockedTrophies"],
		queryFn: async () => {
			const response = await api.chunithm.trophies.unlocked.$get();
			const data = (await response.json()) as UnlockedTrophyResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.data || [];
		},
	});
}

export function useCurrentTrophy() {
	return useQuery({
		queryKey: ["currentTrophy"],
		queryFn: async () => {
			const response = await api.chunithm.trophies.current.$get();
			const data = (await response.json()) as CurrentTrophyResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.data || null;
		},
	});
}

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

			if (!response.ok) {
				throw new Error();
			}

			return true;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentTrophy"] });
		},
	});
}
