import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

/**
 * Fetches and returns the 10 most recent plays that contribute to their rating.
 */

export const useUserRatingBaseHotList = () => {
	return useQuery({
		queryKey: ["userRatingBaseHotList"],
		queryFn: async () => {
			const response = await api.chunithm.rating.user_rating_base_hot_list.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the user's top 30 best plays that contribute to their rating.
 */

export const useUserRatingBaseList = () => {
	return useQuery({
		queryKey: ["userRatingBaseList"],
		queryFn: async () => {
			const response = await api.chunithm.rating.user_rating_base_list.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the 30  most recent plays for the current game version that contribute to the user's rating.
 * - for verse and above
 */

export const useUserRatingBaseNewList = () => {
	return useQuery({
		queryKey: ["userRatingBaseNewList"],
		queryFn: async () => {
			const response = await api.chunithm.rating.user_rating_base_new_list.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}
			return await response.json();
		},
	});
};

/**
 * Fetches and returns 10 potential plays that could improve the user's rating.
 * - for verse and above
 */

export const useUserRatingBaseNextList = () => {
	return useQuery({
		queryKey: ["userRatingBaseNextList"],
		queryFn: async () => {
			const response = await api.chunithm.rating.user_rating_base_next_list.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the player's current rating.
 */
export const usePlayerRating = () => {
	return useQuery({
		queryKey: ["playerRating"],
		queryFn: async () => {
			const response = await api.chunithm.rating.playerRating.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the player's highest achieved rating.
 */
export const useHighestRating = () => {
	return useQuery({
		queryKey: ["highestRating"],
		queryFn: async () => {
			const response = await api.chunithm.rating.highestRating.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
};
