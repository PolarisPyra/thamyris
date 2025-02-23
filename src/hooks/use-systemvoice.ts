import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils";

interface SystemVoice {
	id: number;
	name: string;
	imagePath: string;
}

interface SystemVoiceResponse {
	results: SystemVoice[];
	error?: string;
}

// Fetch all system voices
export function useSystemVoices() {
	return useQuery({
		queryKey: ["systemvoices"],
		queryFn: async () => {
			const response = await api.chunithm.systemvoice.all.$get();
			const data = (await response.json()) as SystemVoiceResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results.map((voice) => ({
				...voice,
				imagePath: voice.imagePath.replace(".dds", ".png"),
			}));
		},
	});
}

// Fetch current system voice
export function useCurrentSystemVoice() {
	return useQuery({
		queryKey: ["currentSystemVoice"],
		queryFn: async () => {
			const response = await api.chunithm.systemvoice.current.$get();
			const data = (await response.json()) as SystemVoiceResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			const voice = data.results[0];
			return voice
				? {
						...voice,
						imagePath: voice.imagePath.replace(".dds", ".png"),
				  }
				: null;
		},
	});
}

// Update system voice mutation
export function useUpdateSystemVoice() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (voiceId: number) => {
			const response = await api.chunithm.systemvoice.update.$post({
				json: { voiceId },
			});
			if (!response.ok) {
				throw new Error("Failed to update system voice");
			}
			return response;
		},
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["currentSystemVoice"] });
		},
	});
}
