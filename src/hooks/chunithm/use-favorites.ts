import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface FavoriteResponse {
	results: { favId: number }[];
	error?: string;
}

export function useFavorites() {
	return useQuery({
		queryKey: ["favorites"],
		queryFn: async () => {
			const response = await api.chunithm.favorites.all.$get();
			const data = (await response.json()) as FavoriteResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results.map((fav) => fav.favId);
		},
	});
}

export function useAddFavorite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (songId: number) => {
			const response = await api.chunithm.favorites.add.$post({
				json: { favId: songId },
			});
			if (!response.ok) {
				throw new Error();
			}
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});
}

export function useRemoveFavorite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (songId: number) => {
			const response = await api.chunithm.favorites.remove.$post({
				json: { favId: songId },
			});
			if (!response.ok) {
				throw new Error();
			}
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});
}
