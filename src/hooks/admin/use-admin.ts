import { useEffect, useState } from "react";

import { api } from "@/utils";

export const useAdminPermissions = () => {
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
