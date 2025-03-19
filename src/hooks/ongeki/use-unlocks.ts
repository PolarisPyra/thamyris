import { useMutation } from "@tanstack/react-query";

import { api } from "@/utils";

interface CardCountResult {
	cards: number;
	level: number;
}

interface CardUnlockResponse {
	result: CardCountResult;
}

export const useUnlockAllCards = () => {
	return useMutation<CardCountResult, Error, number>({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.mods.unlockcards.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as CardUnlockResponse;
			return data.result;
		},
	});
};

export const useUnlockAllItems = () => {
	return useMutation<boolean, Error, number>({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.mods.unlockallitems.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error();
			}

			return true;
		},
	});
};

export const useUnlockSpecificItem = () => {
	return useMutation<boolean, Error, { itemKind: number; version: number }>({
		mutationFn: async ({ itemKind, version }: { itemKind: number; version: number }) => {
			const response = await api.ongeki.mods.unlockspecificitem.$post({
				json: { itemKind, version },
			});

			if (!response.ok) {
				throw new Error();
			}

			return true;
		},
	});
};
