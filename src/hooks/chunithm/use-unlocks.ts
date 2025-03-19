import { useMutation } from "@tanstack/react-query";

import { api } from "@/utils";

export const useUnlockAllSongs = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.modifications.songs.unlock.$post({
				json: { value: 1 },
			});
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
};

export const useLockSongs = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.modifications.songs.lock.$post({
				json: { value: 0 },
			});
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
};

export const useUnlimitedTickets = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.modifications.tickets.unlimited.$post({
				json: { value: 1 },
			});

			if (!response.ok) {
				throw new Error();
			}

			return response.json();
		},
	});
};

export const useLimitedTickets = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.modifications.tickets.limited.$post({
				json: { value: 0 },
			});

			if (!response.ok) {
				throw new Error();
			}

			return response.json();
		},
	});
};
