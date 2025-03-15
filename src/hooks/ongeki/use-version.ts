import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface VersionsResponse {
	versions?: number[];
}

interface VersionResponse {
	version?: number | string;
}

export const useOngekiVersion = () => {
	return useQuery({
		queryKey: ["ongekiVersion"],
		queryFn: async () => {
			const response = await api.ongeki.settings.get.$get();

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as VersionResponse;

			if (!response.ok) {
				throw new Error();
			}

			return Number(data.version);
		},
	});
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
	return useMutation<boolean, Error, string>({
		mutationFn: async (version: string) => {
			const response = await api.ongeki.settings.update.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error();
			}

			return true;
		},
	});
};
