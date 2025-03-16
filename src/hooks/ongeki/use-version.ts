import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

import { useAuth } from "../auth";
import { useCurrentUser } from "../users";

interface VersionsResponse {
	versions?: number[];
}

export const useOngekiVersion = () => {
	const { versions } = useCurrentUser();
	return versions.ongeki_version;
};

export const useOngekiVersions = () => {
	return useQuery({
		queryKey: ["ongekiVersions"],
		queryFn: async () => {
			const response = await api.ongeki.settings.versions.$get();

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as VersionsResponse;

			if (!data.versions) {
				throw new Error();
			}

			return data.versions;
		},
	});
};

export const useUpdateOngekiVersion = () => {
	const { setUser } = useAuth();
	return useMutation({
		mutationFn: async (version: number) => {
			const response = await api.ongeki.settings.update.$post({
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
