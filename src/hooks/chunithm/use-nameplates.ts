import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Nameplate {
	id: number;
	name: string;
	imagePath: string;
}

interface NameplateResponse {
	results: Nameplate[];
	error?: string;
}

// Nameplates
export function useNameplates() {
	return useQuery({
		queryKey: ["nameplates"],
		queryFn: async () => {
			const response = await api.chunithm.nameplates.all.$get();
			const data = (await response.json()) as NameplateResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results.map((nameplate) => ({
				...nameplate,
				imagePath: nameplate.imagePath.replace(".dds", ""),
			}));
		},
	});
}

export function useCurrentNameplate() {
	return useQuery({
		queryKey: ["currentNameplate"],
		queryFn: async () => {
			const response = await api.chunithm.nameplates.current.$get();
			const data = (await response.json()) as NameplateResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			const nameplate = data.results[0];
			return nameplate
				? {
						...nameplate,
						imagePath: nameplate.imagePath.replace(".dds", ""),
					}
				: null;
		},
	});
}

export function useUpdateNameplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (nameplateId: number) => {
			const response = await api.chunithm.nameplates.update.$post({
				json: { nameplateId },
			});
			if (!response.ok) {
				throw new Error("Failed to update nameplate");
			}
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["currentNameplate"] });
		},
	});
}
