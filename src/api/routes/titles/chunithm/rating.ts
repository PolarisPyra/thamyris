import { Hono } from "hono";

import { db } from "@/api/db";
import { ChunitmRating } from "@/utils/helpers";

import { getUserVersionChunithm } from "../../../version";

interface RatingBaseEmptyResponse {
	results: [];
}

interface StaticMusicInfo {
	songId: number;
	title: string;
	artist: string;
	chartId: number;
	level: number;
	genre: string;
	jacketPath: string;
}

interface RatingBaseQueryResult {
	musicId: number;
	score: number;
	difficultId: number;
	version: number;
	type: string;
	isFullCombo: number;
	isAllJustice: number;
	title: string;
	artist: string;
	level: number;
	genre: string;
	chartId: number;
	index?: number;
}

interface RatingBaseResultEntry {
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
	jacketPath: string;
	rating: number;
	isAllJustice?: number | null;
	isFullCombo?: number | null;
}
interface PlayerRatingResponse {
	playerRating: number;
}

interface HighestRatingResponse {
	highestRating: number;
}

interface RatingBaseResponse {
	results: RatingBaseResultEntry[];
}

const UserRatingFramesRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
        r.musicId,
        b.scoreMax as score,
        r.difficultId,
        r.version,
        r.type,
        b.isFullCombo,
        b.isAllJustice,
        m.title,
        m.artist,
        m.level,
        m.genre,
        m.chartId
    FROM chuni_profile_rating r
    JOIN chuni_score_best b 
        ON r.musicId = b.musicId 
        AND r.difficultId = b.level
        AND b.user = r.user
    JOIN chuni_static_music m
        ON r.musicId = m.songId
        AND r.difficultId = m.chartId
        AND r.version = m.version
    WHERE r.user = ?
        AND r.type = 'userRatingBaseHotList'
        AND r.version = ?`,
				[userId, version]
			)) as RatingBaseQueryResult[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingBaseEmptyResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT 
          songId,
          title,
          artist,
          chartId,
          level,
          genre,
          jacketPath
        FROM chuni_static_music
        WHERE songId IN (?)
          AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = ChunitmRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId || "Unknown chartId",
					title: staticMusic?.title || "Unknown Title",
					artist: staticMusic?.artist || "Unknown Artist",
					genre: staticMusic?.genre || "Unknown Genre",
					level: staticMusic?.level || "Unknown Level",
					jacketPath: staticMusic?.jacketPath || "",
					rating,
				};
			});

			return c.json({ results } as RatingBaseResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response("error", { status: 500 });
		}
	})
	.get("/user_rating_base_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			// Get base list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
        r.musicId,
        b.scoreMax as score,
        r.difficultId,
        r.version,
        r.type,
        b.isFullCombo,
        b.isAllJustice,
        m.title,
        m.artist,
        m.level,
        m.genre,
        m.chartId
    FROM chuni_profile_rating r
    JOIN chuni_score_best b 
        ON r.musicId = b.musicId 
        AND r.difficultId = b.level
        AND b.user = r.user
    JOIN chuni_static_music m
        ON r.musicId = m.songId
        AND r.difficultId = m.chartId
        AND r.version = m.version
    WHERE r.user = ?
        AND r.type = 'userRatingBaseList'
        AND r.version = ?`,
				[userId, version]
			)) as RatingBaseQueryResult[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingBaseEmptyResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT 
                songId,
                title,
                artist,
                chartId,
                level,
                genre,
                jacketPath
            FROM chuni_static_music
            WHERE songId IN (?)
                AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = ChunitmRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId || "Unknown chartId",
					title: staticMusic?.title || "Unknown Title",
					artist: staticMusic?.artist || "Unknown Artist",
					genre: staticMusic?.genre || "Unknown Genre",
					level: staticMusic?.level || "Unknown Level",
					jacketPath: staticMusic?.jacketPath || "",
					isAllJustice: entry.isAllJustice ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					rating,
				};
			});

			return c.json({ results } as RatingBaseResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/user_rating_base_new_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const userRatingBaseList = (await db.query(
				`SELECT 
        r.musicId,
        b.scoreMax as score,
        r.difficultId,
        r.version,
        r.type,
        b.isFullCombo,
        b.isAllJustice,
        m.title,
        m.artist,
        m.level,
        m.genre,
        m.chartId
    FROM chuni_profile_rating r
    JOIN chuni_score_best b 
        ON r.musicId = b.musicId 
        AND r.difficultId = b.level
        AND b.user = r.user
    JOIN chuni_static_music m
        ON r.musicId = m.songId
        AND r.difficultId = m.chartId
        AND r.version = m.version
    WHERE r.user = ?
        AND r.type = 'userRatingBaseNewList'
        AND r.version = ?`,
				[userId, version]
			)) as RatingBaseQueryResult[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingBaseEmptyResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT 
                songId,
                title,
                artist,
                chartId,
                level,
                genre,
                jacketPath
            FROM chuni_static_music
            WHERE songId IN (?)
                AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = ChunitmRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId || "Unknown chartId",
					title: staticMusic?.title || "Unknown Title",
					artist: staticMusic?.artist || "Unknown Artist",
					genre: staticMusic?.genre || "Unknown Genre",
					level: staticMusic?.level || "Unknown Level",
					jacketPath: staticMusic?.jacketPath || "",
					rating,
				};
			});

			return c.json({ results } as RatingBaseResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response("error", { status: 500 });
		}
	})
	.get("/user_rating_base_next_list", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const typeFilter = Number(version) >= 17 ? "userRatingBaseNewNextList" : "userRatingBaseNextList";

			const userRatingBaseList = (await db.query(
				`SELECT 
        r.musicId,
        b.scoreMax as score,
        r.difficultId,
        r.version,
        r.type,
        b.isFullCombo,
        b.isAllJustice,
        m.title,
        m.artist,
        m.level,
        m.genre,
        m.chartId
    FROM chuni_profile_rating r
    JOIN chuni_score_best b 
        ON r.musicId = b.musicId 
        AND r.difficultId = b.level
        AND b.user = r.user
    JOIN chuni_static_music m
        ON r.musicId = m.songId
        AND r.difficultId = m.chartId
        AND r.version = m.version
    WHERE r.user = ?
        AND r.type = ?
        AND r.version = ?
   `,
				[userId, typeFilter, version]
			)) as RatingBaseQueryResult[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] } as RatingBaseEmptyResponse);
			}

			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			const staticMusicInfo = (await db.query(
				`SELECT 
          songId,
          title,
          artist,
          chartId,
          level,
          genre,
          jacketPath
        FROM chuni_static_music
        WHERE songId IN (?)
          AND version = ?`,
				[musicIds, version]
			)) as StaticMusicInfo[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = ChunitmRating(level, score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: staticMusic?.chartId || "Unknown chartId",
					title: staticMusic?.title || "Unknown Title",
					artist: staticMusic?.artist || "Unknown Artist",
					genre: staticMusic?.genre || "Unknown Genre",
					level: staticMusic?.level || "Unknown Level",
					jacketPath: staticMusic?.jacketPath || "",
					rating,
				};
			});

			return c.json({ results } as RatingBaseResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response("error", { status: 500 });
		}
	})
	.get("/playerRating", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);

			const [ratingData] = (await db.query(
				`SELECT playerRating
                FROM chuni_profile_data 
                WHERE user = ? 
                AND version = ?`,
				[userId, version]
			)) as [{ playerRating: number }];

			return c.json({ playerRating: ratingData.playerRating } as PlayerRatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})

	.get("/highestRating", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);

			const [ratingData] = (await db.query(
				`SELECT 
								highestRating
                FROM chuni_profile_data 
                WHERE user = ? 
                AND version = ?`,
				[userId, version]
			)) as [{ highestRating: number }];

			return c.json({ highestRating: ratingData.highestRating } as HighestRatingResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response("error", { status: 500 });
		}
	});

export { UserRatingFramesRoutes };
