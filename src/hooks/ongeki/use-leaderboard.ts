import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface LeaderboardEntry {
	userId: number;
	username: string;
	rating: string;
}

interface LeaderboardResponse {
	results: LeaderboardEntry[];
}

export function useLeaderboard() {
	return useQuery({
		queryKey: ["ongeki", "leaderboard"],
		queryFn: async () => {
			const response = await api.ongeki.leaderboard.$get();
			const data = (await response.json()) as LeaderboardResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results.map((entry, index) => ({
				...entry,
				rank: index + 1,
			}));
		},
	});
}
