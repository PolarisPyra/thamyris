import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

// Fetch Chunithm scores
export function useChunithmScores() {
	return useQuery({
		queryKey: ["chunithm", "scores"],
		queryFn: async () => {
			const response = await api.chunithm.chuni_score_playlog.$get();
			const data = await response.json();

			if (!response.ok) {
				throw new Error();
			}

			return data.map((score) => ({
				...score,
				userPlayDate: new Date(new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				score: Math.floor(score.score),
				scoreChange: score.score_change,
				ratingChange: score.rating_change,
			}));
		},
	});
}
