import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface LeaderboardEntry {
	userId: number;
	username: string;
	rating: string;
}

interface LeaderboardResponse {
	results: LeaderboardEntry[];
	error?: string;
}

export function useLeaderboard() {
	return useQuery({
		queryKey: ["ongeki", "leaderboard"],
		queryFn: async () => {
			const response = await api.ongeki.leaderboard.$get();
			const data = (await response.json()) as LeaderboardResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results.map((entry, index) => ({
				...entry,
				rank: index + 1,
			}));
		},
	});
}
