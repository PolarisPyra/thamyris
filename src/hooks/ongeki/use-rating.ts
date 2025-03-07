import { useQuery } from "@tanstack/react-query";

import { RatingResponse, UserRatingEntry } from "@/types/types";
import { api } from "@/utils";

/**
 * Fetches and returns the 10 most recent plays that could increase the user's rating.
 */

export const useUserRatingBaseHotList = () => {
	return useQuery<UserRatingEntry[]>({
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
	return useQuery<UserRatingEntry[]>({
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
 * Fetches and returns the 15 most recent plays from the current version that contribute to the user's rating.
 */

export const useUserRatingBaseBestNewList = () => {
	return useQuery<UserRatingEntry[]>({
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

/**
 * Fetches and returns 10 potential plays that could improve the user's rating.
 */

export const useUserRatingBaseNextList = () => {
	return useQuery<UserRatingEntry[]>({
		queryKey: ["userRatingBaseNextList"],
		queryFn: async () => {
			const response = await api.ongeki.user_rating_base_next_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};

/**
 * Fetches and returns the player's current rating.
 */
export const usePlayerRating = () => {
	return useQuery<number>({
		queryKey: ["playerRating"],
		queryFn: async () => {
			const response = await api.ongeki.player_rating.$get();
			const data = (await response.json()) as { rating: number; error?: string };

			if (data.error) {
				throw new Error(data.error);
			}

			return data.rating;
		},
	});
};

/**
 * Fetches and returns the player's highest achieved rating.
 */
export const useHighestRating = () => {
	return useQuery<number>({
		queryKey: ["highestRating"],
		queryFn: async () => {
			const response = await api.ongeki.highest_rating.$get();
			const data = (await response.json()) as { rating: number; error?: string };

			if (data.error) {
				throw new Error(data.error);
			}

			return data.rating;
		},
	});
};
