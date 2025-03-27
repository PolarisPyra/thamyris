import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

/**
 * Fetches and returns the user's top 30 best plays that contribute to their rating.
 */
export const useUserNewRatingBaseBestList = () => {
	return useQuery({
		queryKey: ["userNewRatingBaseBestList"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.userNewRatingBaseBestList.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch rating data");
			}
			return await response.json();
		},
		select: (data) => {
			return [...data].sort((a, b) => b.score - a.score);
		},
	});
};

/**
 * Fetches and returns the most recent plays for the current game version that contribute to the user's rating.
 */
export const useUserNewRatingBaseBestNewList = () => {
	return useQuery({
		queryKey: ["userNewRatingBaseBestNewList"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.userNewRatingBaseBestNewList.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch rating data");
			}
			return await response.json();
		},
	});
};
export const useUserNewRatingBasePScoreList = () => {
	return useQuery({
		queryKey: ["userNewRatingBasePScoreList"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.userNewRatingBasePScoreList.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch rating data");
			}
			return await response.json();
		},
	});
};

/**
 * Fetches and returns potential plays that could improve the user's rating.
 */
export const useUserNewRatingBaseNextBestList = () => {
	return useQuery({
		queryKey: ["userNewRatingBaseNextBestList"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.userNewRatingBaseNextBestList.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch rating data");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the player's current rating.
 */
export const useNewPlayerRating = () => {
	return useQuery({
		queryKey: ["newPlayerRating"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.newPlayerRating.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch player rating");
			}

			return await response.json();
		},
	});
};

/**
 * Fetches and returns the player's highest achieved rating.
 */
export const useNewHighestRating = () => {
	return useQuery({
		queryKey: ["newHighestRating"],
		queryFn: async () => {
			const response = await api.ongeki.newRating.newHighestRating.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch highest rating");
			}

			return await response.json();
		},
	});
};
