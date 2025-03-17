import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useMapIcons() {
	return useQuery({
		queryKey: ["mapicons"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.all.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch map icons");
			}

			const data = await response.json();

			return data || {};
		},
	});
}

export function useCurrentMapIcon() {
	return useQuery({
		queryKey: ["currentMapIcon"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.current.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch map icons");
			}

			return await response.json();
		},
	});
}

export function useUpdateMapIcon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (mapIconId: number) => {
			const response = await api.chunithm.mapicon.update.$post({
				json: { mapIconId, version: 0, userId: 0 },
			});

			if (!response.ok) {
				throw new Error("Failed to update map icon");
			}
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentMapIcon"] });
		},
	});
}
