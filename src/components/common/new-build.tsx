import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { api } from "@/utils/api";

export function BuildUpdateChecker() {
	const [initialBuildHash] = useState(env.BUILD_HASH);

	const checkForUpdates = useCallback(async () => {
		try {
			const response = await api.users.buildinfo.$get({
				query: { t: Date.now() },
			});
			if (!response.ok) return false;

			const data = await response.json();

			if (data.buildHash && data.buildHash !== initialBuildHash) {
				toast.info("New version available", {
					duration: Infinity,
					action: {
						label: "Refresh now",
						onClick: () => window.location.reload(),
					},
				});
				return true;
			}
		} catch (error) {
			console.error("Failed to check for updates:", error);
		}
		return false;
	}, [initialBuildHash]);

	useEffect(() => {
		checkForUpdates();
		const interval = setInterval(checkForUpdates, 60 * 1000);
		return () => clearInterval(interval);
	}, [checkForUpdates]);

	return null;
}
