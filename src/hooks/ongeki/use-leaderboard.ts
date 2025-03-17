import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

export function useLeaderboard() {
	return useQuery({
		queryKey: ["ongeki", "leaderboard"],
		queryFn: async () => {
			const response = await api.ongeki.leaderboard.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch leaderboard data");
			}

			const results = await response.json();
			return results.map((entry, index) => ({
				...entry,
				rank: index + 1,
			}));
		},
	});
}
