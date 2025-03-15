import { useQuery } from "@tanstack/react-query";

import { RatingResponse, UserRatingEntry } from "@/types/types";
import { api } from "@/utils";

/**
 * Fetches and returns the 10 most recent plays that contribute to their rating.
 */

export const useUserRatingBaseHotList = () => {
	return useQuery<UserRatingEntry[]>({
		queryKey: ["userRatingBaseHotList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_hot_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results;
		},
	});
};

/**
 * Fetches and returns the user's top 30 best plays that contribute to their rating.
 */

export const useUserRatingBaseList = () => {
	return useQuery<UserRatingEntry[]>({
		queryKey: ["userRatingBaseList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results;
		},
	});
};

/**
 * Fetches and returns the 30  most recent plays for the current game version that contribute to the user's rating.
 * - for verse and above
 */

export const useUserRatingBaseNewList = () => {
	return useQuery<UserRatingEntry[]>({
		queryKey: ["userRatingBaseNewList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_new_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results;
		},
	});
};

/**
 * Fetches and returns 10 potential plays that could improve the user's rating.
 * - for verse and above
 */

export const useUserRatingBaseNextList = () => {
	return useQuery<UserRatingEntry[]>({
		queryKey: ["userRatingBaseNextList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_next_list.$get();
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
			const response = await api.chunithm.playerRating.$get();
			const data = (await response.json()) as { playerRating: number; error?: string };

			if (data.error) {
				throw new Error(data.error);
			}

			return data.playerRating;
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
			const response = await api.chunithm.highestRating.$get();
			const data = (await response.json()) as { highestRating: number; error?: string };

			if (data.error) {
				throw new Error(data.error);
			}

			return data.highestRating;
		},
	});
};
