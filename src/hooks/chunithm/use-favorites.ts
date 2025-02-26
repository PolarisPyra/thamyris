import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface FavoriteResponse {
  results: { favId: number }[];
  error?: string;
}

// Fetch favorite songs
export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.chunithm.favorites.all.$get();
      const data = (await response.json()) as FavoriteResponse;

      if (data.error) {
        throw new Error(data.error);
      }

      return data.results.map((fav) => fav.favId);
    },
  });
}

// Add favorite mutation
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId: number) => {
      const response = await api.chunithm.favorites.add.$post({
        json: { favId: songId },
      });
      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// Remove favorite mutation
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId: number) => {
      const response = await api.chunithm.favorites.remove.$post({
        json: { favId: songId },
      });
      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
