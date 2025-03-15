import { useQuery } from "@tanstack/react-query";

import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { api } from "@/utils";

interface B30ExportData {
	honor: string;
	name: string;
	rating: number;
	ratingMax: number;
	updatedAt: string;
	best: Array<{
		title: string;
		artist: string;
		score: number;
		rank: string;
		diff: string;
		const: number;
		rating: number;
		date: number;
		is_fullcombo: number;
		is_alljustice: number;
	}>;
	recent: Array<{
		title: string;
		artist: string;
		score: number;
		rank: string;
		diff: string;
		const: number;
		rating: number;
		date: number;
	}>;
}

/**
 * Hook to fetch Chunithm Reiwa export data
 * @returns Query result with Reiwa export data
 */
export const useReiwaExport = () => {
	const { data: version } = useChunithmVersion();

	return useQuery<B30ExportData>({
		queryKey: ["chunithm", "reiwa", "export", version],
		queryFn: async () => {
			const response = await api.chunithm.reiwa.export.$get();

			if (!response.ok) {
				throw new Error();
			}

			return response.json() as Promise<B30ExportData>;
		},
		enabled: !!version,
	});
};
