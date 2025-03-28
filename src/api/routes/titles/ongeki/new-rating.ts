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
	isFullBell?: number;
	isFullCombo?: number;
	isAllBreake?: number;
};

const NewUserRatingFramesRoutes = new Hono()
	.get("userNewRatingBaseBestList", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
				`SELECT 
          r.musicId,
          b.techScoreMax,
          b.platinumScoreMax,
          b.platinumScoreStar,
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
          AND r.type = 'userNewRatingBaseBestList'
          AND r.version = ?`,
				[userId, version]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("userNewRatingBasePScoreList", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
				`SELECT 
          r.musicId,
          b.techScoreMax,
          b.platinumScoreMax,
          b.platinumScoreStar,
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
          AND r.type = 'userNewRatingBasePScoreList'
          AND r.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("userNewRatingBaseBestNewList", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
				`SELECT 
          r.musicId,
          b.techScoreMax,
          b.platinumScoreMax,
          b.platinumScoreStar,
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
          AND r.type = 'userNewRatingBaseBestNewList'
          AND r.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("userNewRatingBaseNextBestList", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<ExtendedOngekiProfileRating>(
				`SELECT 
          r.musicId,
          b.techScoreMax,
          b.platinumScoreMax,
          b.platinumScoreStar,
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
          AND r.type = 'userNewRatingBaseNextBestList'
          AND r.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})

	.get("newPlayerRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiProfileData>(
				`SELECT  newPlayerRating
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
	.get("newHighestRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiProfileData>(
				`SELECT newHighestRating

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

export { NewUserRatingFramesRoutes };
