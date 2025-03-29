import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

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
	});
};

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
