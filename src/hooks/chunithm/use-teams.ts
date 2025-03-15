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
	message: string;
	teamId: number;
}

interface CreateTeamError {
	error: string;
}

type CreateTeamResponse = CreateTeamSuccess | CreateTeamError;

export function useTeams() {
	return useQuery({
		queryKey: ["teams"],
		queryFn: async () => {
			const response = await api.chunithm.teams.$get();
			const data = (await response.json()) as TeamResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results;
		},
	});
}

export function useUpdateTeam() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (teamId: number) => {
			const response = await api.chunithm.updateteam.$post({
				json: { teamId },
			});
			if (!response.ok) {
				throw new Error();
			}
			return true;
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
			const data = (await response.json()) as CreateTeamResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data as CreateTeamSuccess;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
}
