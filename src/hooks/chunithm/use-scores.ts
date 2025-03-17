import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

// Fetch Chunithm scores
export function useChunithmScores() {
	return useQuery({
		queryKey: ["chunithm", "scores"],
		queryFn: async () => {
			const response = await api.chunithm.chuni_score_playlog.$get();

			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
