import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";
import { ChunitmRating } from "@/utils/helpers";

// includes joined tables
type ExtendedChuniProfileRating = DB.ChuniProfileRating & {
	score: number;
	level: number;
	title: string;
	artist: string;
	genre: string;
	chartId: number;
	jacketPath: string;
	isFullCombo: boolean;
	isAllJustice: boolean;
};

const UserRatingFramesRoutes = new Hono()
	.get("user_rating_base_hot_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					b.isFullCombo,
					b.isAllJustice,
					m.title,
					m.artist,
					m.level,
					m.genre,
					m.chartId,
					m.jacketPath
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
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("user_rating_base_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					b.isFullCombo,
					b.isAllJustice,
					m.title,
					m.artist,
					m.level,
					m.genre,
					m.chartId,
					m.jacketPath
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
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("/user_rating_base_new_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					b.isFullCombo,
					b.isAllJustice,
					m.title,
					m.artist,
					m.level,
					m.genre,
					m.chartId,
					m.jacketPath
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
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})
	.get("user_rating_base_next_list", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const typeFilter = Number(version) >= 17 ? "userRatingBaseNewNextList" : "userRatingBaseNextList";

			const results = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					b.isFullCombo,
					b.isAllJustice,
					m.title,
					m.artist,
					m.level,
					m.genre,
					m.chartId,
					m.jacketPath
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
					AND r.version = ?`,
				[userId, typeFilter, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rating base", error);
		}
	})

	.get("playerRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniProfileData>(
				`SELECT playerRating
				FROM chuni_profile_data 
				WHERE user = ? 
				AND version = ?`,
				[userId, version]
			);

			if (!results.length) {
				return c.json({ playerRating: 0 });
			}

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get player rating", error);
		}
	})
	.get("highestRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniProfileData>(
				`SELECT highestRating
				FROM chuni_profile_data 
				WHERE user = ? 
				AND version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get player rating", error);
		}
	})
	.get("totalAverageRating", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			// Get all songs from the rating lists
			const baseListSongs = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					m.level
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
			);

			const hotListSongs = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					m.level
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
			);

			const newListSongs = await db.select<ExtendedChuniProfileRating>(
				`SELECT 
					r.musicId,
					b.scoreMax as score,
					r.difficultId,
					r.version,
					r.type,
					r.index,
					m.level
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
			);

			// Combine all songs
			const allSongs = [...baseListSongs, ...hotListSongs, ...newListSongs];

			// Calculate total rating
			let totalRating = 0;
			for (const song of allSongs) {
				if (song.level && song.score) {
					totalRating += ChunitmRating(song.level, song.score);
				}
			}

			// Calculate average rating
			const averageRating = allSongs.length > 0 ? (totalRating / allSongs.length / 100).toFixed(2) : "0.00";

			return c.json({
				averageRating,
				totalSongs: allSongs.length,
				baseListCount: baseListSongs.length,
				hotListCount: hotListSongs.length,
				newListCount: newListSongs.length,
			});
		} catch (error) {
			throw rethrowWithMessage("Failed to get total average rating", error);
		}
	});

export { UserRatingFramesRoutes };
