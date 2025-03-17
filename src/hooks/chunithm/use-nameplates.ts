import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useNameplates() {
	return useQuery({
		queryKey: ["nameplates"],
		queryFn: async () => {
			const response = await api.chunithm.nameplate.all.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			const data = await response.json();

			return data || {};
		},
	});
}

export function useCurrentNameplates() {
	return useQuery({
		queryKey: ["currentNameplates"],
		queryFn: async () => {
			const response = await api.chunithm.nameplate.current.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch nameplates");
			}

			return await response.json();
		},
	});
}

export function useUpdateNameplate() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (nameplateId: number) => {
			const response = await api.chunithm.nameplate.update.$post({
				json: {
					nameplateId,
					userId: 0,
					version: 0,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to update nameplate");
			}
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentNameplate"] });
		},
	});
}
