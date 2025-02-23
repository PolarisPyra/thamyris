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

interface UserResponse {
	username: string;
	error?: string;
}
// Fetch username
export function useUsername() {
	return useQuery({
		queryKey: ["username"],
		queryFn: async () => {
			const response = await api.users.username.$get();
			const data = (await response.json()) as UserResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.username;
		},
	});
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

			return data.results;
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

			return data.results;
		},
	});
}
