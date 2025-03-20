import { useCallback } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TrophyRareType, cdnUrl, honorBackgrounds } from "@/lib/constants";
import { api } from "@/utils";

export function useUnlockedTrophies() {
	return useQuery({
		queryKey: ["unlockedTrophies"],
		queryFn: async () => {
			const response = await api.chunithm.trophy.unlocked.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch systemvoices");
			}

			return await response.json();
		},
	});
}

export function useCurrentTrophy() {
	return useQuery({
		queryKey: ["currentTrophy"],
		queryFn: async () => {
			const response = await api.chunithm.trophy.current.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch systemvoices");
			}

			return await response.json();
		},
	});
}

export function useHonorBackground() {
	const { data } = useUnlockedTrophies();
	const imagePath = data?.[0]?.imagePath;

	return useCallback(
		(trophy: { rareType: number; imagePath?: string | null }) => {
			if (
				trophy.rareType === TrophyRareType.Kop ||
				trophy.rareType === TrophyRareType.Lamp ||
				trophy.rareType === TrophyRareType.Lamp2 ||
				trophy.rareType === TrophyRareType.Lamp3
			) {
				const path = trophy.imagePath || imagePath;
				return `${cdnUrl}assets/trophy/${path?.replace(".dds", ".png")}`;
			}

			return honorBackgrounds[trophy.rareType as TrophyRareType];
		},
		[imagePath]
	);
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
			const response = await api.chunithm.trophy.update.$post({
				json: { mainTrophyId, subTrophy1Id, subTrophy2Id },
			});

			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentTrophy"] });
		},
	});
}
