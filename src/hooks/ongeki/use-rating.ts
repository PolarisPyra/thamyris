import { api } from "@/utils";
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

interface RatingResponse {
	results: UserRatingBaseEntry[];
	error?: string;
}

export const useUserRatingBaseHotList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseHotList"],
		queryFn: async () => {
			const response = await api.ongeki.user_rating_base_hot_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};

export const useUserRatingBaseBestList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseBestList"],
		queryFn: async () => {
			const response = await api.ongeki.user_rating_base_best_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};

export const useUserRatingBaseBestNewList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseBestNewList"],
		queryFn: async () => {
			const response = await api.ongeki.user_rating_base_best_new_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};
