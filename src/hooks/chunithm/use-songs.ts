import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils";

export interface Song {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	artist: string;
	jacketPath: string;
}

interface SongResponse {
	results: Song[];
	error?: string;
}

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
			return data.results.sort((a, b) => b.id - a.id);
		},
	});
}

export function useOngekiSongs() {
	return useQuery({
		queryKey: ["ongeki", "songs"],
		queryFn: async () => {
			const response = await api.ongeki.ongeki_static_music.$get();
			const data = (await response.json()) as SongResponse;

			if (data.error) {
				throw new Error(data.error);
			}
			// moved to client side for faster queries
			// Sort by id in descending order
			return data.results.sort((a, b) => b.id - a.id);
		},
	});
}
