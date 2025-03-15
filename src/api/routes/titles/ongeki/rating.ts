import { Hono } from "hono";

import { db } from "@/api/db";
import { OngekiRating } from "@/utils/helpers";

import { getUserVersionOngeki } from "../../../version";

interface UserRatingBaseEntry {
	musicId: number;
	score: number;
	difficultId: number;
	version: number;
	type: string;
	index?: number;
	isFullBell?: boolean;
	isFullCombo?: boolean;
	isAllBreake?: boolean;
	title?: string;
	artist?: string;
	level?: number;
	genre?: string;
	chartId?: number | string;
}

interface StaticMusicInfo {
	songId: number;
	title: string;
	artist: string;
	chartId: number | string;
	level: number;
	genre: string;
	jacketPath?: string;
}

interface RatingResult {
	type: string;
	version: number;
	index?: number;
	musicId: number;
	score: number;
	difficultId: number;
	chartId: string | number;
	title: string;
	artist: string;
	genre: string;
	level: string | number;
	jacketPath?: string;
	rating: number;
	isFullBell?: boolean | null;
	isFullCombo?: boolean | null;
	isAllBreake?: boolean | null;
}

interface RatingResponse {
	results: RatingResult[];
}

interface HighestRatingResponse {
	highestRating: number;
}

interface PlayerRatingResponse {
	rating: number;
}

const OngekiRatingRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionOngeki(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
                r.musicId,
                b.techScoreMax as score,
                r.difficultId,
                r.version,
                r.type,
                b.isFullBell,
                b.isFullCombo,
                b.isAllBreake,
                m.title,
                m.artist,
                m.level,
                m.genre,
                m.chartId
            FROM ongeki_profile_rating r
            JOIN ongeki_score_best b 
                ON r.musicId = b.musicId 
                AND r.difficultId = b.level
                AND b.user = r.user
            JOIN ongeki_static_music m
                ON r.musicId = m.songId
                AND r.difficultId = m.chartId
                AND r.version = m.version
            WHERE r.user = ?
                AND r.type = 'userRatingBaseHotList'
                AND r.version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT 
					songId,
					title,
					artist,
					chartId,
					level,
					genre
					FROM ongeki_static_music
				WHERE songId IN (?)
					AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results: RatingResult[] = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = OngekiRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId ?? 0,
					title: staticMusic?.title ?? "Unknown Title",
					artist: staticMusic?.artist ?? "Unknown Artist",
					genre: staticMusic?.genre ?? "Unknown Genre",
					level: staticMusic?.level ?? 0,
					jacketPath: staticMusic?.jacketPath ?? "",
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
				};
			});

			return c.json({ results } as RatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})

	.get("/user_rating_base_next_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionOngeki(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
                r.musicId,
                b.techScoreMax as score,
                r.difficultId,
                r.version,
                r.type,
                b.isFullBell,
                b.isFullCombo,
                b.isAllBreake,
                m.title,
                m.artist,
                m.level,
                m.genre,
                m.chartId
            FROM ongeki_profile_rating r
            JOIN ongeki_score_best b 
                ON r.musicId = b.musicId 
                AND r.difficultId = b.level
                AND b.user = r.user
            JOIN ongeki_static_music m
                ON r.musicId = m.songId
                AND r.difficultId = m.chartId
                AND r.version = m.version
            WHERE r.user = ?
                AND r.type = 'userRatingBaseNextList'
                AND r.version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT
					songId,
					title,
					artist,
					chartId,
					level,
					genre
					FROM ongeki_static_music
				WHERE songId IN (?)
					AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results: RatingResult[] = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = OngekiRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId ?? 0,
					title: staticMusic?.title ?? "Unknown Title",
					artist: staticMusic?.artist ?? "Unknown Artist",
					genre: staticMusic?.genre ?? "Unknown Genre",
					level: staticMusic?.level ?? 0,
					jacketPath: staticMusic?.jacketPath ?? "",
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
				};
			});

			return c.json({ results } as RatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/user_rating_base_best_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
                r.musicId,
                b.techScoreMax as score,
                r.difficultId,
                r.version,
                r.type,
                r.index,
                b.isFullBell,
                b.isFullCombo,
                b.isAllBreake,
                m.title,
                m.artist,
                m.level,
                m.genre,
                m.chartId
            FROM ongeki_profile_rating r
            JOIN ongeki_score_best b 
                ON r.musicId = b.musicId 
                AND r.difficultId = b.level
                AND b.user = r.user
            JOIN ongeki_static_music m
                ON r.musicId = m.songId
                AND r.difficultId = m.chartId
                AND r.version = m.version
            WHERE r.user = ?
                AND r.type = 'userRatingBaseBestList'
                AND r.version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingResponse);
			}

			const results: RatingResult[] = userRatingBaseList.map((entry) => {
				const rating = OngekiRating(entry.level ?? 0, entry.score ?? 0);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: entry.chartId ?? 0,
					title: entry.title ?? "Unknown Title",
					artist: entry.artist ?? "Unknown Artist",
					genre: entry.genre ?? "Unknown Genre",
					level: entry.level ?? 0,
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
				};
			});

			return c.json({ results } as RatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/user_rating_base_best_new_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
                r.musicId,
                b.techScoreMax as score,
                r.difficultId,
                r.version,
                r.type,
                r.index,
                b.isFullBell,
                b.isFullCombo,
                b.isAllBreake,
                m.title,
                m.artist,
                m.level,
                m.genre,
                m.chartId
            FROM ongeki_profile_rating r
            JOIN ongeki_score_best b 
                ON r.musicId = b.musicId 
                AND r.difficultId = b.level
                AND b.user = r.user
            JOIN ongeki_static_music m
                ON r.musicId = m.songId
                AND r.difficultId = m.chartId
                AND r.version = m.version
            WHERE r.user = ?
                AND r.type = 'userRatingBaseBestNewList'
                AND r.version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingResponse);
			}

			const results: RatingResult[] = userRatingBaseList.map((entry) => {
				const rating = OngekiRating(entry.level ?? 0, entry.score ?? 0);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: entry.chartId ?? 0,
					title: entry.title ?? "Unknown Title",
					artist: entry.artist ?? "Unknown Artist",
					genre: entry.genre ?? "Unknown Genre",
					level: entry.level ?? 0,
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
				};
			});

			return c.json({ results } as RatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/player_rating", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const result = (await db.query(
				`SELECT playerRating 
                FROM ongeki_profile_data 
                WHERE user = ? 
                AND version = ?`,
				[userId, version]
			)) as { playerRating: number }[];

			if (!result || !result[0]) {
				return c.json({ rating: 0 } as PlayerRatingResponse);
			}

			return c.json({ rating: result[0].playerRating ?? 0 } as PlayerRatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/highest_rating", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const result = (await db.query(
				`SELECT highestRating 
                 FROM ongeki_profile_data 
                 WHERE user = ? 
                 AND version = ?`,
				[userId, version]
			)) as { highestRating: number }[];

			if (!result || !result[0]) {
				return c.json({ highestRating: 0 } as HighestRatingResponse);
			}

			return c.json({ highestRating: result[0].highestRating ?? 0 } as HighestRatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	});

export { OngekiRatingRoutes };
