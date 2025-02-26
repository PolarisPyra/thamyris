import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api";
import { env } from "@/env";
import { UserRatingBaseEntry } from "@/utils/types";

import { getUserVersionOngeki } from "../../../version";

const OngekiRatingRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);

			// Get the user rating base hot list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
					musicId,
					score,
					difficultId,
					version,
					type
				FROM ongeki_profile_rating
				WHERE user = ?
					AND type = 'userRatingBaseHotList'
					AND version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			// Get the music IDs to fetch static music info
			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			// Get static music information
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
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			// Calculate ratings and combine data
			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = calculateRating(level, score);

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

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base hot list" }, 500);
		}
	})
	.get("/user_rating_base_hot_next_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);

			// Get the user rating base hot list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
					musicId,
					score,
					difficultId,
					version,
					type
				FROM ongeki_profile_rating
				WHERE user = ?
					AND type = 'userRatingBaseHotNextList'
					AND version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			// Get the music IDs to fetch static music info
			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			// Get static music information
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
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			// Calculate ratings and combine data
			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = calculateRating(level, score);

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

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base hot list" }, 500);
		}
	})
	.get("/user_rating_base_best_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);

			// Get base list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
					musicId,
					score,
					difficultId,
					version,
					type
				FROM ongeki_profile_rating
				WHERE user = ?
					AND type = 'userRatingBaseBestList'
					AND version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			// Get the music IDs to fetch static music info
			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			// Get static music information
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
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			// Calculate ratings and combine data
			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = calculateRating(level, score);

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

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base best list" }, 500);
		}
	})
	.get("/user_rating_base_best_new_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);

			// Get new list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
					musicId,
					score,
					difficultId,
					version,
					type
				FROM ongeki_profile_rating
				WHERE user = ?
					AND type = 'userRatingBaseBestNewList'
					AND version = ?`,
				[userId, version]
			)) as UserRatingBaseEntry[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			// Get the music IDs to fetch static music info
			const musicIds = userRatingBaseList.map((entry) => entry.musicId);

			// Get static music information
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
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

			// Calculate ratings and combine data
			const results = userRatingBaseList.map((entry) => {
				const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
				const level = staticMusic?.level ?? 0;
				const score = entry.score ?? 0;

				const rating = calculateRating(level, score);

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

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base best new list" }, 500);
		}
	});

// Rating calculation function
function calculateRating(level: number, score: number): number {
	const iclInt = level * 100;

	// Return 0 if score is too low to earn any rating
	if (score < 970000) {
		return 0;
	}

	if (score >= 1007500) {
		return iclInt + 200; // +2.00 for SSS+
	} else if (score >= 1000000) {
		return iclInt + 150 + Math.floor((score - 1000000) / 150); // +1.50 for SSS, then +0.01 per 150 points
	} else if (score >= 990000) {
		return iclInt + 100 + Math.floor((score - 990000) / 200); // +1.00 for SS, then +0.01 per 200 points
	} else if (score >= 970000) {
		return iclInt + Math.floor((score - 970000) / 200); // ±0 at 970000, then +0.01 per 200 points
	}

	return 0; // Fallback return 0
}
export { OngekiRatingRoutes };
