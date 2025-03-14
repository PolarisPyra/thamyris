import { useMutation } from "@tanstack/react-query";

import { api } from "@/utils";

// Define the response interface to match Chunithm pattern
export interface UnlockResponse {
	success: boolean;
	message: string;
}

export const useUnlockAllCards = () => {
	return useMutation({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.unlockcards.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error("Failed to unlock cards");
			}

			const data = (await response.json()) as UnlockResponse;
			return data;
		},
	});
};

export const useUnlockAllItems = () => {
	return useMutation({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.unlockallitems.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error("Failed to unlock items");
			}

			const data = (await response.json()) as UnlockResponse;
			return data;
		},
	});
};

export const useUnlockSpecificItem = () => {
	return useMutation({
		mutationFn: async ({ itemKind, version }: { itemKind: number; version: number }) => {
			const response = await api.ongeki.unlockspecificitem.$post({
				json: { itemKind, version },
			});

			if (!response.ok) {
				throw new Error(`Failed to unlock item kind ${itemKind}`);
			}

			const data = (await response.json()) as UnlockResponse;
			return data;
		},
	});
};
