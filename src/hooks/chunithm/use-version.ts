import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface VersionsResponse {
	versions?: number[];
}

interface UpdateVersionResponse {
	success: boolean;
	version: number | string;
	message: string;
}

interface VersionResponse {
	version?: number | string;
}

export const useChunithmVersion = () => {
	return useQuery({
		queryKey: ["chunithmVersion"],
		queryFn: async () => {
			const response = await api.chunithm.settings.get.$get();

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

export const useChunithmVersions = () => {
	return useQuery({
		queryKey: ["chunithmVersions"],
		queryFn: async () => {
			const response = await api.chunithm.settings.versions.$get();

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as VersionsResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.versions;
		},
	});
};

export const useUpdateChunithmVersion = () => {
	return useMutation({
		mutationFn: async (version: string) => {
			const response = await api.chunithm.settings.update.$post({
				json: { version },
			});

			if (!response.ok) {
				throw new Error();
			}

			const data = (await response.json()) as UpdateVersionResponse;
			return data;
		},
	});
};
