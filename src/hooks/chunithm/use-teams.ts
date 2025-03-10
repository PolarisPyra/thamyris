import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Team {
	id: number;
	teamName: string;
}

interface TeamResponse {
	results: Team[];
	error?: string;
}

// Fetch all teams
export function useTeams() {
	return useQuery({
		queryKey: ["teams"],
		queryFn: async () => {
			const response = await api.chunithm.teams.$get();
			const data = (await response.json()) as TeamResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
}

// Update team mutation
export function useUpdateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (teamId: number) => {
			const response = await api.chunithm.updateteam.$post({
				json: { teamId },
			});
			if (!response.ok) {
				throw new Error("Failed to update team");
			}
			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch teams query
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
}
