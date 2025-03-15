import { useQuery } from "@tanstack/react-query";

import { api } from "@/utils";

interface BaseScore {
	id: number;
	maxCombo: number;
	isFullCombo: number;
	userPlayDate: string;
	playerRating: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	jacketPath: string;
	artist: string;
	rating_change: string;
}

interface ChunithmScore extends BaseScore {
	isAllJustice: number;
	score: number;
	judgeHeaven: number;
	judgeGuilty: number;
	judgeJustice: number;
	judgeAttack: number;
	judgeCritical: number;
	isClear: number;
	skillId: number;
	isNewRecord: number;
	score_change: string;
	rating: number;
}

interface OngekiScore extends BaseScore {
	isAllBreak: number;
	isFullBell: number;
	techScore: number;
	battleScore: number;
	judgeMiss: number;
	judgeHit: number;
	judgeBreak: number;
	judgeCriticalBreak: number;
	clearStatus: number;
	cardId1: number;
	techscore_change: string;
	battlescore_change: string;
}

interface ChunithmScoreResponse {
	results: ChunithmScore[];
	error?: string;
}

interface OngekiScoreResponse {
	results: OngekiScore[];
	error?: string;
}

export function useChunithmScores() {
	return useQuery({
		queryKey: ["chunithm", "scores"],
		queryFn: async () => {
			const response = await api.chunithm.chuni_score_playlog.$get();
			const data = (await response.json()) as ChunithmScoreResponse;

			if (!response.ok) {
				throw new Error();
			}

			return data.results.map((score) => ({
				...score,
				userPlayDate: new Date(new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				score: Math.floor(score.score),
				scoreChange: score.score_change,
				ratingChange: score.rating_change,
			}));
		},
	});
}

export function useOngekiScores() {
	return useQuery({
		queryKey: ["ongeki", "scores"],
		queryFn: async () => {
			const response = await api.ongeki.ongeki_score_playlog.$get();
			const data = (await response.json()) as OngekiScoreResponse;
			if (!response.ok) {
				throw new Error();
			}

			return data.results.map((score) => ({
				...score,
				userPlayDate: new Date(new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				techScore: Math.floor(score.techScore),
				battleScore: Math.floor(score.battleScore),
			}));
		},
	});
}
