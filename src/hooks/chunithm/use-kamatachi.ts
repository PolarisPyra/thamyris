/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface KamaitachiExportResponse {
	success: boolean;
	data?: any;
	message?: string;
}

/**
 * Hook to fetch Kamaitachi export data for Chunithm
 * Returns data in the format required by Kamaitachi
 */
export const useKamaitachiExport = () => {
	return useQuery({
		queryKey: ["chunithm", "kamaitachi", "export"],
		queryFn: async () => {
			const response = await api.chunithm.kamaitachi.export.$get();
			const data = (await response.json()) as KamaitachiExportResponse;

			if (!data.success) {
				throw new Error(data.message || "Failed to export Kamaitachi data");
			}

			return data.data;
		},
	});
};
