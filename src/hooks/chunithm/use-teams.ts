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

interface CreateTeamSuccess {
	success: boolean;
	message: string;
	teamId: number;
}

interface CreateTeamError {
	error: string;
}

type CreateTeamResponse = CreateTeamSuccess | CreateTeamError;

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

// Create team mutation
export function useCreateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (teamName: string) => {
			const response = await api.chunithm.addteam.$post({
				json: { teamName },
			});
			const data = (await response.json()) as CreateTeamResponse;

			if (!response.ok) {
				const errorMessage = "error" in data ? data.error : "Failed to create team";
				throw new Error(errorMessage);
			}

			return data as CreateTeamSuccess;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
}
