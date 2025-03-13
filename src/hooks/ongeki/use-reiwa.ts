import { useQuery } from "@tanstack/react-query";

import { useOngekiVersion } from "@/hooks/ongeki/use-version";
import { api } from "@/utils";

interface B45ExportData {
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
		is_fullbell: number;
		is_allbreak: number;
		is_fullcombo: number;
	}>;
	news: Array<{
		title: string;
		artist: string;
		score: number;
		rank: string;
		diff: string;
		const: number;
		rating: number;
		date: number;
		is_fullbell: number;
		is_allbreak: number;
		is_fullcombo: number;
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

interface ReiwaResponse {
	success: boolean;
	data?: B45ExportData;
	error?: string;
	message?: string;
}

/**
 * Hook to fetch Ongeki Reiwa export data
 * @returns Query result with Reiwa export data
 */
export const useReiwaExport = () => {
	const { data: version } = useOngekiVersion();

	return useQuery<B45ExportData>({
		queryKey: ["ongeki", "reiwa", "export", version],
		queryFn: async () => {
			const response = await api.ongeki.reiwa.export.$get();
			const data = (await response.json()) as ReiwaResponse;

			if (!data.success || data.error) {
				throw new Error(data.error || data.message || "Failed to fetch export data");
			}

			return data.data!;
		},
		enabled: !!version,
	});
};
