import { useQuery } from "@tanstack/react-query";

import { useOngekiVersion } from "@/hooks/ongeki";
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

			if (!response.ok) {
				throw new Error();
			}

			return response.json() as Promise<B45ExportData>;
		},
		enabled: !!version,
	});
};
