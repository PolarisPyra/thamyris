import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Rivals {
	id: number;
	isMutual: boolean;
	username: string;
}

interface OngekiApiResponse {
	results: Rivals[];
}

interface RivalCountResponse {
	rivalCount: number;
}

interface RivalResponse {
	results: number[];
}

interface MutualResponse {
	results: { rivalId: number; isMutual: number }[];
}

// Fetch all rivals
export function useRivals() {
	return useQuery({
		queryKey: ["ongeki", "rivals", "all"],
		queryFn: async () => {
			const response = await api.ongeki.rivals.all.$get();
			
			if (!response.ok) {
				throw new Error();
			}
			
			const data = (await response.json()) as RivalResponse;
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
			
			if (!response.ok) {
				throw new Error();
			}
			
			const data = (await response.json()) as RivalCountResponse;
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

			if (!usersResp.ok || !mutualResp.ok) {
				throw new Error();
			}

			const usersData = (await usersResp.json()) as OngekiApiResponse;
			const mutualData = (await mutualResp.json()) as MutualResponse;

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

			if (!response.ok) {
				throw new Error();
			}
			
			// Return an empty success object since the API returns no content
			return {};
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

			if (!response.ok) {
				throw new Error();
			}
			
			// Return an empty success object since the API returns no content
			return {};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ongeki", "rivals"] });
		},
	});
}
