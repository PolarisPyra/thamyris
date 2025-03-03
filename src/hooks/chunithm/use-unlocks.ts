import { useMutation } from "@tanstack/react-query";

import { api } from "@/utils";

export const useUnlockAllSongs = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.settings.songs.unlock.$post();

			if (!response.ok) {
				throw new Error("Failed to unlock all songs");
			}

			return response.json();
		},
	});
};

export const useLockSongs = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.settings.songs.lock.$post();

			if (!response.ok) {
				throw new Error("Failed to lock songs");
			}

			return response.json();
		},
	});
};

export const useUnlimitedTickets = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.settings.tickets.unlimited.$post();

			if (!response.ok) {
				throw new Error("Failed to enable unlimited tickets");
			}

			return response.json();
		},
	});
};

export const useLimitedTickets = () => {
	return useMutation({
		mutationFn: async () => {
			const response = await api.chunithm.settings.tickets.limited.$post();

			if (!response.ok) {
				throw new Error("Failed to disable unlimited tickets");
			}

			return response.json();
		},
	});
};
