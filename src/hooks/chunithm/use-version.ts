import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

import { useAuth } from "../auth";
import { useCurrentUser } from "../users";

export const useChunithmVersion = (): number => {
	const { versions } = useCurrentUser();
	return versions.chunithm_version;
};

export const useChunithmVersions = () => {
	return useQuery({
		queryKey: ["chunithmVersions"],
		queryFn: async () => {
			const response = await api.chunithm.settings.versions.$get();
			if (!response.ok) {
				throw new Error();
			}

			return await response.json();
		},
	});
};

export const useUpdateChunithmVersion = () => {
	const { setUser } = useAuth();
	return useMutation({
		mutationFn: async (version: number) => {
			const response = await api.chunithm.settings.update.$post({
				json: { version },
			});
			if (!response.ok) {
				throw new Error();
			}

			const user = await response.json();
			setUser(user);
		},
	});
};
