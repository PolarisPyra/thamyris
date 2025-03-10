/* eslint-disable @typescript-eslint/no-explicit-any */
// we will eventually need to type this out properly
import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

const UserRatingFramesRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c) => {
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
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
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
			)) as any[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

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
	.get("/user_rating_base_list", async (c) => {
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
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
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
			)) as any[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

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
					isAllJustice: entry.isAllJustice ?? null,
					isFullCombo: entry.isFullCombo ?? null,

					rating,
				};
			});

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch user rating base list" }, 500);
		}
	})
	.get("/user_rating_base_new_list", async (c) => {
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
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
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
			)) as any[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

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
			return c.json({ error: "Failed to fetch user rating base new list" }, 500);
		}
	})
	.get("/user_rating_base_next_list", async (c) => {
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
			)) as any[];

			if (!userRatingBaseList.length) {
				return c.json({ results: [] });
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
			)) as any[];

			const songIdtoChartId = new Map(staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music]));

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
			return c.json({ error: "Failed to fetch user rating base next list" }, 500);
		}
	})
	.get("/playerRating", async (c) => {
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

			return c.json({ playerRating: ratingData.playerRating });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch player rating" }, 500);
		}
	})

	.get("/highestRating", async (c) => {
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

			return c.json({ highestRating: ratingData.highestRating });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch player rating" }, 500);
		}
	});

function calculateRating(level: number, score: number): number {
	if (score >= 1009000) {
		return level * 100 + 215;
	} else if (score >= 1007500) {
		return level * 100 + 200 + (score - 1007500) / 100;
	} else if (score >= 1005000) {
		return level * 100 + 150 + (score - 1005000) / 50;
	} else if (score >= 1000000) {
		return level * 100 + 100 + (score - 1000000) / 100;
	} else if (score >= 975000) {
		return level * 100 + (score - 975000) / 250;
	} else if (score >= 925000) {
		return level * 100 - 300 + ((score - 925000) * 3) / 500;
	} else if (score >= 900000) {
		return level * 100 - 500 + ((score - 900000) * 4) / 500;
	} else if (score >= 800000) {
		return (level * 100 - 500) / 2 + ((score - 800000) * ((level - 500) / 2)) / 100000;
	} else {
		return 0;
	}
}

export { UserRatingFramesRoutes };
