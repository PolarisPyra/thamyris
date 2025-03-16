import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useFavorites() {
	return useQuery({
		queryKey: ["favorites"],
		queryFn: async () => {
			const response = await api.chunithm.favorites.all.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch favorites");
			}

			const data = await response.json();
			return data.map((fav: { favId: number }) => fav.favId);
		},
	});
}

export function useAddFavorite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (favId: number) => {
			const response = await api.chunithm.favorites.add.$post({
				json: {
					favId,
					user: 0,
					version: 0,
					favKind: 0,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to add favorite");
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});
}

export function useRemoveFavorite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (favId: number) => {
			const response = await api.chunithm.favorites.remove.$post({
				json: {
					favId,
					user: 0,
					version: 0,
					favKind: 0,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to remove favorite");
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});
}
