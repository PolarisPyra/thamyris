import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

// includes joined tables
type ExtendedOngekiProfileRating = DB.OngekiProfileRating & {
	score: number;
	level: number;
	title: string;
	artist: string;
	genre: string;
	chartId: number;
	jacketPath?: string;
	isFullBell?: boolean;
	isFullCombo?: boolean;
	isAllBreake?: boolean;
};

const UserRatingFramesRoutes = new Hono()
	.get("user_rating_base_hot_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
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
          AND r.type = 'userRatingBaseHotList'
          AND r.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("user_rating_base_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
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
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("/user_rating_base_new_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
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
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("user_rating_base_next_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
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
          AND r.type = 'userRatingBaseNextList'
          AND r.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})

	.get("playerRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiProfileData>(
				`SELECT playerRating
        FROM ongeki_profile_data 
        WHERE user = ? 
        AND version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get player rating", error);
		}
	})
	.get("highestRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiProfileData>(
				`SELECT highestRating
        FROM ongeki_profile_data 
        WHERE user = ? 
        AND version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get player rating", error);
		}
	});

export { UserRatingFramesRoutes as OngekiRatingRoutes };
