import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Rivals {
	id: number;
	isMutual: boolean;
	username: string;
}

interface OngekiApiResponse {
	results: Rivals[];
	error?: string;
}

interface RivalCountResponse {
	rivalCount: number;
	error?: string;
}

interface RivalResponse {
	results: number[];
	error?: string;
}

interface MutualResponse {
	results: { rivalId: number; isMutual: number }[];
	error?: string;
}

interface MutationResponse {
	success: boolean;
	error?: string;
}

// Fetch all rivals
export function useRivals() {
	return useQuery({
		queryKey: ["ongeki", "rivals", "all"],
		queryFn: async () => {
			const response = await api.ongeki.rivals.all.$get();
			const data = (await response.json()) as RivalResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.results;
		},
	});
}

// Fetch rival count
export function useRivalCount() {
	return useQuery({
		queryKey: ["ongeki", "rivals", "count"],
		queryFn: async () => {
			const response = await api.ongeki.rivals.count.$get();
			const data = (await response.json()) as RivalCountResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data.rivalCount;
		},
	});
}

// Fetch rival users
export function useRivalUsers() {
	return useQuery({
		queryKey: ["ongeki", "rivals", "users"],
		queryFn: async () => {
			const [usersResp, mutualResp] = await Promise.all([
				api.ongeki.rivals.userlookup.$get(),
				api.ongeki.rivals.mutual.$get(),
			]);

			const usersData = (await usersResp.json()) as OngekiApiResponse;
			const mutualData = (await mutualResp.json()) as MutualResponse;

			if (usersData.error) {
				throw new Error(usersData.error);
			}

			if (mutualData.error) {
				throw new Error(mutualData.error);
			}

			const mutualRivals = new Set(mutualData.results.filter((r) => r.isMutual === 1).map((r) => r.rivalId));

			return usersData.results.map((response) => ({
				id: response.id,
				username: response.username,
				isMutual: mutualRivals.has(response.id),
			}));
		},
	});
}

// Add rival mutation
export function useAddRival() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (rivalUserId: number) => {
			const response = await api.ongeki.rivals.add.$post({
				json: { rivalUserId },
			});
			const data = (await response.json()) as MutationResponse;

			if (!response.ok || !data.success) {
				throw new Error(data.error || "Failed to add rival");
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ongeki", "rivals"] });
		},
	});
}

// Remove rival mutation
export function useRemoveRival() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (rivalUserId: number) => {
			const response = await api.ongeki.rivals.remove.$post({
				json: { rivalUserId },
			});
			const data = (await response.json()) as MutationResponse;

			if (!response.ok || !data.success) {
				throw new Error(data.error || "Failed to remove rival");
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ongeki", "rivals"] });
		},
	});
}
