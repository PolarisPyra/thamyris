import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Fetch all map icons
export function useMapIcons() {
	return useQuery({
		queryKey: ["mapicons"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.all.$get();
			const data = (await response.json()) as MapIconResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results.map((icon) => ({
				...icon,
				imagePath: icon.imagePath.replace(".dds", ".png"),
			}));
		},
	});
}

// Fetch current map icon
export function useCurrentMapIcon() {
	return useQuery({
		queryKey: ["currentMapIcon"],
		queryFn: async () => {
			const response = await api.chunithm.mapicon.current.$get();
			const data = (await response.json()) as MapIconResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			const icon = data.results[0];
			return icon
				? {
						...icon,
						imagePath: icon.imagePath.replace(".dds", ".png"),
				  }
				: null;
		},
	});
}

// Update map icon mutation
export function useUpdateMapIcon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (mapIconId: number) => {
			const response = await api.chunithm.mapicon.update.$post({
				json: { mapIconId },
			});
			if (!response.ok) {
				throw new Error("Failed to update map icon");
			}
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["currentMapIcon"] });
		},
	});
}
