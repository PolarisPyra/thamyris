import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionChunithm } from "../../../version";
import { env } from "@/env";

interface UserRatingBaseEntry {
	musicId: string;
	score: number;
	difficultId: string;
	version: number;
	index: number;
	type: string;
}

const UserRatingFramesRoutes = new Hono()
	.get("/user_rating_base_hot_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			// First get the user rating base list
			const userRatingBaseList = (await db.query(
				`SELECT 
          musicId,
          score,
          difficultId,
          version,
          \`index\`,
          type
        FROM chuni_profile_rating
        WHERE user = ?
          AND type = 'userRatingBaseHotList'
          AND version = ?
        ORDER BY \`index\` ASC`,
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
          genre,
          jacketPath
        FROM chuni_static_music
        WHERE songId IN (?)
          AND version = ?`,
				[musicIds, version]
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(
				staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music])
			);

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
	.get("/user_rating_base_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			// Get both base and new list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
          musicId,
          score,
          difficultId,
          version,
          type
        FROM chuni_profile_rating
        WHERE user = ?
          AND type IN ('userRatingBaseList', 'userRatingBaseNewList')
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
          genre,
          jacketPath
        FROM chuni_static_music
        WHERE songId IN (?)
          AND version = ?`,
				[musicIds, version]
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(
				staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music])
			);

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
			return c.json({ error: "Failed to fetch user rating base list" }, 500);
		}
	})
	.get("/user_rating_base_next_list", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			const typeFilter =
				Number(version) >= 17 ? "userRatingBaseNewNextList" : "userRatingBaseNextList";

			// Get next list entries
			const userRatingBaseList = (await db.query(
				`SELECT 
          musicId,
          score,
          difficultId,
          version,
          type
        FROM chuni_profile_rating
        WHERE user = ?
          AND type = ?
          AND version = ?`,
				[userId, typeFilter, version]
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
          genre,
          jacketPath
        FROM chuni_static_music
        WHERE songId IN (?)
          AND version = ?`,
				[musicIds, version]
			)) as any[];

			// Create a map for easy lookup
			const songIdtoChartId = new Map(
				staticMusicInfo.map((music) => [`${music.songId}-${music.chartId}`, music])
			);

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
			return c.json({ error: "Failed to fetch user rating base next list" }, 500);
		}
	});

// Rating calculation function
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
