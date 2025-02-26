import { api } from "@/utils";
import { RatingResponse, UserRatingBaseEntry } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

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

export const useUserRatingBaseHotNextList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseHotNextList"],
		queryFn: async () => {
			const response = await api.ongeki.user_rating_base_hot_next_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};
