import { useMutation } from "@tanstack/react-query";

import { api } from "@/utils";

export const useUnlockAllCards = () => {
	return useMutation({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.unlockcards.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error("Failed to unlock cards");
			}

			return response.json();
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

			return response.json();
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

			return response.json();
		},
	});
};
