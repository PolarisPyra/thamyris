import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

interface Rivals {
	id: number;
	isMutual: boolean;
	username: string;
}

interface ChunithmApiResponse {
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

export function useRivals() {
	return useQuery({
		queryKey: ["rivals", "all"],
		queryFn: async () => {
			const response = await api.chunithm.rivals.all.$get();

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as RivalResponse;
			return data.results;
		},
	});
}

export function useRivalCount() {
	return useQuery({
		queryKey: ["rivals", "count"],
		queryFn: async () => {
			const response = await api.chunithm.rivals.count.$get();

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as RivalCountResponse;
			return data.rivalCount;
		},
	});
}

export function useRivalUsers() {
	return useQuery({
		queryKey: ["rivals", "users"],
		queryFn: async () => {
			const [usersResp, mutualResp] = await Promise.all([
				api.chunithm.rivals.userlookup.$get(),
				api.chunithm.rivals.mutual.$get(),
			]);

			if (!usersResp.ok || !mutualResp.ok) {
				throw new Error();
			}

			const usersData = (await usersResp.json()) as ChunithmApiResponse;
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

export function useAddRival() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (favId: number) => {
			const response = await api.chunithm.rivals.add.$post({
				json: { favId },
			});

			if (!response.ok) {
				throw new Error();
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rivals"] });
		},
	});
}

export function useRemoveRival() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (favId: number) => {
			const response = await api.chunithm.rivals.remove.$post({
				json: { favId },
			});

			if (!response.ok) {
				throw new Error();
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rivals"] });
		},
	});
}
