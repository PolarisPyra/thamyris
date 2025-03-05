import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface UpdateAimecardResponse {
	success?: boolean;
	error?: string;
}

export function useUpdateAimecard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (accessCode: string) => {
			const response = await api.users["update-aimecard"].$post({
				json: { accessCode },
			});
			const data = (await response.json()) as UpdateAimecardResponse;

			if (!response.ok || !data.success) {
				throw new Error(data.error || "Failed to update aime card");
			}

			return data;
		},
		onSuccess: () => {
			// Invalidate user data queries if needed
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
}
