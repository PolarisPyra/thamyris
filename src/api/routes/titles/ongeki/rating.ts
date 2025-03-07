/* eslint-disable @typescript-eslint/no-explicit-any */
// we will eventually need to type this out properly
import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionOngeki } from "../../../version";

const OngekiRatingRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c) => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionOngeki(userId);

			// Get the user rating base hot list entries
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
			)) as any[];

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

	// .get("/user_rating_base_hot_next_list", async (c) => {
	// 	try {
	// 		const userId = c.payload.userId;

	// 		const version = await getUserVersionOngeki(userId);

	// 		// Get the user rating base hot list entries
	// 		const userRatingBaseList = (await db.query(
	// 			`SELECT
	//               r.musicId,
	//               b.techScoreMax as score,
	//               r.difficultId,
	//               r.version,
	//               r.type,
	//               b.isFullBell,
	//               b.isFullCombo,
	//               b.isAllBreake,
	//               m.title,
	//               m.artist,
	//               m.level,
	//               m.genre,
	//               m.chartId
	//           FROM ongeki_profile_rating r
	//           JOIN ongeki_score_best b
	//               ON r.musicId = b.musicId
	//               AND r.difficultId = b.level
	//               AND b.user = r.user
	//           JOIN ongeki_static_music m
	//               ON r.musicId = m.songId
	//               AND r.difficultId = m.chartId
	//               AND r.version = m.version
	//           WHERE r.user = ?
	//               AND r.type = 'userRatingBaseHotNextList'
	//               AND r.version = ?`,
	// 			[userId, version]
	// 		)) as UserRatingBaseEntry[];

	// 		if (!userRatingBaseList.length) {
	// 			return c.json({ results: [] });
	// 		}

	// 		// Get the music IDs to fetch static music info
	// 		const musicIds = userRatingBaseList.map((entry) => entry.musicId);

	// 		// Get static music information
	// 		const staticMusicInfo = (await db.query(
	// 			`SELECT
	// 				songId,
	// 				title,
	// 				artist,
	// 				chartId,
	// 				level,
	// 				genre
	// 				FROM ongeki_static_music
	// 			WHERE songId IN (?)
	// 				AND version = ?`,
	// 			[musicIds, version]
	// 		)) as any[];

	// 		// Create a map for easy lookup
	// 		const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

	// 		// Calculate ratings and combine data
	// 		const results = userRatingBaseList.map((entry) => {
	// 			const staticMusic = songIdtoChartId.get(`${entry.musicId}-${entry.difficultId}`);
	// 			const level = staticMusic?.level ?? 0;
	// 			const score = entry.score ?? 0;

	// 			const rating = calculateRating(level, score);

	// 			return {
	// 				type: entry.type,
	// 				version: entry.version,
	// 				index: entry.index,
	// 				musicId: entry.musicId,
	// 				score: entry.score,
	// 				difficultId: entry.difficultId,
	// 				chartId: staticMusic?.chartId || "Unknown chartId",
	// 				title: staticMusic?.title || "Unknown Title",
	// 				artist: staticMusic?.artist || "Unknown Artist",
	// 				genre: staticMusic?.genre || "Unknown Genre",
	// 				level: staticMusic?.level || "Unknown Level",
	// 				jacketPath: staticMusic?.jacketPath || "",
	// 				rating,
	// 			};
	// 		});

	// 		return c.json({ results });
	// 	} catch (error) {
	// 		console.error("Error executing query:", error);
	// 		return c.json({ error: "Failed to fetch user rating base hot list" }, 500);
	// 	}
	// })

	.get("/user_rating_base_next_list", async (c) => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionOngeki(userId);

			// Get the user rating base hot list entries
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
			)) as any[];

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
                AND r.type = 'userRatingBaseBestList'
                AND r.version = ?`,
				[userId, version]
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			const results = userRatingBaseList.map((entry) => {
				const rating = calculateRating(entry.level, entry.score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: entry.chartId,
					title: entry.title || "Unknown Title",
					artist: entry.artist || "Unknown Artist",
					genre: entry.genre || "Unknown Genre",
					level: entry.level || 0,
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
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
                AND r.type = 'userRatingBaseBestNewList'
                AND r.version = ?`,
				[userId, version]
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
			}

			const results = userRatingBaseList.map((entry) => {
				const rating = calculateRating(entry.level, entry.score);

				return {
					type: entry.type,
					version: entry.version,
					index: entry.index,
					musicId: entry.musicId,
					score: entry.score,
					difficultId: entry.difficultId,
					chartId: entry.chartId,
					title: entry.title || "Unknown Title",
					artist: entry.artist || "Unknown Artist",
					genre: entry.genre || "Unknown Genre",
					level: entry.level || 0,
					rating,
					isFullBell: entry.isFullBell ?? null,
					isFullCombo: entry.isFullCombo ?? null,
					isAllBreake: entry.isAllBreake ?? null,
				};
			});

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base best new list" }, 500);
		}
	})
	.get("/player_rating", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const result = await db.query(
				`SELECT playerRating 
                FROM ongeki_profile_data 
                WHERE user = ? 
                AND version = ?`,
				[userId, version]
			);

			if (!result || !result[0]) {
				return c.json({ rating: 0 });
			}

			return c.json({ rating: result[0].playerRating || 0 });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch player rating" }, 500);
		}
	})
	.get("/highest_rating", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const result = await db.query(
				`SELECT highestRating 
                FROM ongeki_profile_data 
                WHERE user = ? 
                AND version = ?`,
				[userId, version]
			);

			if (!result || !result[0]) {
				return c.json({ rating: 0 });
			}

			return c.json({ rating: result[0].highestRating || 0 });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch highest rating" }, 500);
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
