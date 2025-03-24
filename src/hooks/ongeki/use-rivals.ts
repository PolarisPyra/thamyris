import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

// Fetch all rivals
export function useRivals() {
	return useQuery({
		queryKey: ["ongeki", "rivals", "all"],
		queryFn: async () => {
			const response = await api.ongeki.rivals.all.$get();

			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
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

			return await response.json();
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
