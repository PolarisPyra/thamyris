import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { api } from "@/utils/api";

export function BuildUpdateChecker() {
	const [initialBuildDate] = useState(env.BUILD_TIME_12_HOUR);

	const checkForUpdates = useCallback(async () => {
		try {
			const response = await api.users.buildinfo.$get();
			if (!response.ok) return false;

			const data = await response.json();

			if (data.buildDate && data.buildDate !== initialBuildDate) {
				toast.info(`New version available (${data.buildDate})`, {
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
	}, [initialBuildDate]);

	useEffect(() => {
		checkForUpdates();

		const interval = setInterval(checkForUpdates, 60 * 1000);

		return () => clearInterval(interval);
	}, [checkForUpdates]);

	return null;
}
