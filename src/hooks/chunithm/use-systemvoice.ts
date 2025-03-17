import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useSystemVoices() {
	return useQuery({
		queryKey: ["systemvoices"],
		queryFn: async () => {
			const response = await api.chunithm.systemvoice.all.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch systemvoices");
			}

			const data = await response.json();

			return data || {};
		},
	});
}

export function useCurrentSystemVoice() {
	return useQuery({
		queryKey: ["currentSystemvoice"],
		queryFn: async () => {
			const response = await api.chunithm.systemvoice.current.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch systemvoices");
			}

			return await response.json();
		},
	});
}

export function useUpdateSystemVoice() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (voiceId: number) => {
			const response = await api.chunithm.systemvoice.update.$post({
				json: { voiceId, version: 0, userId: 0 },
			});

			if (!response.ok) {
				throw new Error("Failed to update systemvoice");
			}
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentSystemvoice"] });
		},
	});
}
