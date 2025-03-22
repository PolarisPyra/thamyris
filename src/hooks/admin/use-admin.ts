import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/utils";

export function useArcades() {
	return useQuery({
		queryKey: ["arcades"],
		queryFn: async () => {
			const response = await api.admin.arcades.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const response = await api.admin.users.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
}
export function useUpdateArcadeOwnership() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ arcade, user }: { arcade: number; user: number }) => {
			const response = await api.admin.update.$post({
				json: {
					arcade,
					user,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to update nameplate");
			}
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["currentNameplate"] });
		},
	});
}

export const useAdmin = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const checkAdminStatus = async () => {
			try {
				const response = await api.admin.check.$get();
				// Check if the response is OK (200-299)
				if (response.ok) {
					setIsAdmin(true);
				} else {
					// This handles 403 without throwing an error to the console
					setIsAdmin(false);
				}
			} catch {
				// This will only trigger for network errors
				setError("Failed to verify admin status");
				setIsAdmin(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAdminStatus();
	}, []);

	return { isAdmin, isLoading, error };
};
