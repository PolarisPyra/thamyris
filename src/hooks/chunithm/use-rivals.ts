import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useRivals() {
	return useQuery({
		queryKey: ["rivals", "all"],
		queryFn: async () => {
			const response = await api.chunithm.rivals.all.$get();

			if (!response.ok) {
				throw new Error();
			}
			return await response.json();
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

			return await response.json();
		},
	});
}

export function useRivalUsers() {
	return useQuery({
		queryKey: ["rivals", "users"],
		queryFn: async () => {
			const [usersResp, mutualResp] = await Promise.all([
				api.chunithm.rivals.userlookup.$get().then(),
				api.chunithm.rivals.mutual.$get(),
			]);

			if (!usersResp.ok || !mutualResp.ok) {
				throw new Error();
			}

			const usersData = await usersResp.json();
			const mutualData = await mutualResp.json();

			const mutualRivals = new Set(mutualData.filter((r) => r.isMutual === 1).map((r) => r.rivalId));

			return usersData.map((response) => ({
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
