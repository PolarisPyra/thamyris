import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

// Fetch Ongeki scores
export function useOngekiScores() {
	return useQuery({
		queryKey: ["ongeki", "scores"],
		queryFn: async () => {
			const response = await api.ongeki.ongeki_score_playlog.$get();
			const data = await response.json();
			if (!response.ok) {
				throw new Error();
			}

			return data.map((score) => ({
				...score,
				userPlayDate: new Date(new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				techScore: Math.floor(score.techScore),
				battleScore: Math.floor(score.battleScore),
			}));
		},
	});
}
