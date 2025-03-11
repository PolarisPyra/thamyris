import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface VersionsResponse {
	versions?: number[];
	error?: string;
	message?: string;
}

interface UpdateVersionResponse {
	version: number;
	error?: string;
	message?: string;
}

interface VersionResponse {
	version?: number;
	error?: string;
	message?: string;
}

export const useChunithmVersion = () => {
	return useQuery({
		queryKey: ["chunithmVersion"],
		queryFn: async () => {
			const response = await api.chunithm.settings.get.$get();
			const data = (await response.json()) as VersionResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			if (!data.version) {
				throw new Error("Version not found");
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
			const data = (await response.json()) as VersionsResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			if (!data.versions) {
				throw new Error("Versions not found");
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

			const data = (await response.json()) as UpdateVersionResponse;

			if (data.error) {
				throw new Error(data.error);
			}

			return data;
		},
	});
};
