import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Team {
	id: number;
	teamName: string;
}

export function useTeams() {
	return useQuery({
		queryKey: ["teams"],
		queryFn: async () => {
			const response = await api.chunithm.teams.teams.$get();

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

	return useMutation({
		mutationFn: async (teamId: number) => {
			const response = await api.chunithm.teams.updateteam.$post({
				json: { teamId, version: 0, userId: 0 },
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
			const response = await api.chunithm.teams.addteam.$post({
				json: {
					teamName,
				},
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
