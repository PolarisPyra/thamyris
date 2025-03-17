import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

import { useCurrentUser } from "../users";
import { useChunithmVersion } from "./use-version";

interface Team {
	id: number;
	teamName: string;
}

export function useTeams() {
	return useQuery({
		queryKey: ["teams"],
		queryFn: async () => {
			const response = await api.chunithm.teams.$get();

			if (!response.ok) {
				throw new Error("Failed to fetch teams");
			}

			const data = await response.json();
			return data as Team[];
		},
	});
}

export function useUpdateTeam() {
	const queryClient = useQueryClient();
	const version = useChunithmVersion();
	const { userId } = useCurrentUser();

	return useMutation({
		mutationFn: async (teamId: number) => {
			const response = await api.chunithm.updateteam.$post({
				json: {
					teamId,
					user: userId,
					version,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to update team");
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
}

export function useCreateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (teamName: string) => {
			const response = await api.chunithm.addteam.$post({
				json: { teamName },
			});

			if (!response.ok) {
				throw new Error("Failed to add team");
			}
			return await response.json();
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
}
