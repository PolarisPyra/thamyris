import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

export function useLeaderboard() {
	return useQuery({
		queryKey: ["ongeki", "leaderboard"],
		queryFn: async () => {
			const response = await api.ongeki.leaderboard.$get();
			const data = await response.json();

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
