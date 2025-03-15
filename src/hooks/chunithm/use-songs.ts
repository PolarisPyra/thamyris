import { useQuery } from "@tanstack/react-query";

import { SongResponse } from "@/types";
import { api } from "@/utils";

export function useChunithmSongs() {
	return useQuery({
		queryKey: ["chunithm", "songs"],
		queryFn: async () => {
			const response = await api.chunithm.chuni_static_music.$get();
			const data = (await response.json()) as SongResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			// Sort by id in descending order
			return data.results.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
		},
	});
}
