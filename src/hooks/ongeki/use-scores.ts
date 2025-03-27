import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

// Fetch Ongeki scores
export function useOngekiScores() {
	return useQuery({
		queryKey: ["ongeki", "scores"],
		queryFn: async () => {
			const response = await api.ongeki.ongeki_score_playlog.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
