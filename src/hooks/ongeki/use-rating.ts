import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";
import { RatingResponse, UserRatingBaseEntry } from "@/utils/types";

/**
 * Fetches and returns the 10 most recent plays that could increase the user's rating.
 */

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

/**
 * Fetches and returns the user's top 30 best plays that contribute to their rating.
 */

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

/**
 * Fetches and returns the 10 most recent plays that contribute to the user's rating.
 */

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

// /**
//  * Fetches and returns 10 potential plays that could improve the user's rating.
//  */

// export const useUserRatingBaseHotNextList = () => {
// 	return useQuery<UserRatingBaseEntry[]>({
// 		queryKey: ["userRatingBaseHotNextList"],
// 		queryFn: async () => {
// 			const response = await api.ongeki.user_rating_base_hot_next_list.$get();
// 			const data = (await response.json()) as RatingResponse;

// 			if (data.error) {
// 				throw new Error(data.error);
// 			}

// 			return data.results;
// 		},
// 	});
// };
