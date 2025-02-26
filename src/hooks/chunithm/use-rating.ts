import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils";
import { RatingResponse, UserRatingBaseEntry } from "@/utils/types";

export const useUserRatingBaseHotList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseHotList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_hot_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};

export const useUserRatingBaseList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};

export const useUserRatingBaseNewList = () => {
	return useQuery<UserRatingBaseEntry[]>({
		queryKey: ["userRatingBaseNewList"],
		queryFn: async () => {
			const response = await api.chunithm.user_rating_base_new_list.$get();
			const data = (await response.json()) as RatingResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
};
export const useUserRatingBaseNextList = () => {
	return useQuery<UserRatingBaseEntry[]>({
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
