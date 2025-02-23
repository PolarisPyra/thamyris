import { useQuery } from "@tanstack/react-query";

interface UserRatingBaseEntry {
	type: string;
	version: number;
	index: number;
	musicId: string;
	score: number;
	difficultId: string;
	chartId: string;
	title: string;
	artist: string;
	genre: string;
	level: string | number;
	jacketPath: string;
	rating: number;
}

export const useUserRatingBaseHotList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseHotList"],
		queryFn: async () => {
			const response = await fetch("/api/chunithm/user_rating_base_hot_list");
			if (!response.ok) {
				throw new Error("Failed to fetch user rating base hot list");
			}
			const data = await response.json();
			return data.results;
		},
	});
};

export const useUserRatingBaseList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseList"],
		queryFn: async () => {
			const response = await fetch("/api/chunithm/user_rating_base_list");
			if (!response.ok) {
				throw new Error("Failed to fetch user rating base list");
			}
			const data = await response.json();
			return data.results;
		},
	});
};

export const useUserRatingBaseNextList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseNextList"],
		queryFn: async () => {
			const response = await fetch("/api/chunithm/user_rating_base_next_list");
			if (!response.ok) {
				throw new Error("Failed to fetch user rating base next list");
			}
			const data = await response.json();
			return data.results;
		},
	});
};
