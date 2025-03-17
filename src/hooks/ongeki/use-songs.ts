import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

export function useOngekiSongs() {
	return useQuery({
		queryKey: ["ongeki", "songs"],
		queryFn: async () => {
			const response = await api.ongeki.ongeki_static_music.$get();

			if (!response.ok) {
				throw new Error("Failed to fetch songs");
			}

			return await response.json();
		},
	});
}
