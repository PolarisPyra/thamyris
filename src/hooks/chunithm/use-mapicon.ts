import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface MapIcon {
	id: number;
	name: string;
	imagePath: string;
}

interface MapIconResponse {
	results: MapIcon[];
	error?: string;
}

export function useMapIcons() {
	return useQuery({
		queryKey: ["mapicons"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.all.$get();
			const data = (await response.json()) as MapIconResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results.map((icon) => ({
				...icon,
				imagePath: icon.imagePath.replace(".dds", ""),
			}));
		},
	});
}

export function useCurrentMapIcon() {
	return useQuery({
		queryKey: ["currentMapIcon"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.current.$get();
			const data = (await response.json()) as MapIconResponse;

			if (!response.ok) {
				throw new Error();
			}

			const icon = data.results[0];
			return icon
				? {
						...icon,
						imagePath: icon.imagePath.replace(".dds", ""),
					}
				: null;
		},
	});
}
export function useUpdateMapIcon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (mapIconId: number) => {
			const response = await api.chunithm.mapicon.update.$post({
				json: { mapIconId },
			});
			if (!response.ok) {
				throw new Error();
			}
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["currentMapIcon"] });
		},
	});
}
