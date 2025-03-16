import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";
import { ChunitmRating, getDifficultyFromChunithmChart, getGrade } from "@/utils/helpers";

interface ChunithmSongResult {
	musicId: number;
	score: number;
	difficultId: number;
	version: string;
	type: string;
	isFullCombo?: number;
	isAllJustice?: number;
	title: string;
	artist: string;
	level: number;
	genre: string;
	chartId: number;
}

const ChunithmReiwaRoutes = new Hono().get("export", async (c) => {
	try {
		const { userId, versions } = c.payload;
		const version = versions.chunithm_version;

		const usernameResults = await db.query(`SELECT username FROM aime_user WHERE id = ?`, [userId]);
		const username = usernameResults.length > 0 ? usernameResults[0].username : "Player";

		const ratingResults = await db.query(
			`SELECT playerRating, highestRating FROM chuni_profile_data WHERE user = ? AND version = ?`,
			[userId, version]
		);
		const playerRating = ratingResults.length > 0 ? ratingResults[0].playerRating : 0;
		const highestRating = ratingResults.length > 0 ? ratingResults[0].highestRating : 0;

		const bestListResults = await db.query(
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
		);

		const hotListResults = await db.query(
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
		);

		const b30 = bestListResults
			.filter((song: ChunithmSongResult) => song.musicId !== 0)
			.map((song: ChunithmSongResult) => {
				const rating = ChunitmRating(song.level, song.score);
				return {
					title: song.title,
					artist: song.artist,
					score: song.score,
					rank: getGrade(song.score),
					diff: getDifficultyFromChunithmChart(song.chartId),
					const: song.level,
					rating: Number((rating / 100).toFixed(2)),
					date: Date.now(),
					is_fullcombo: song.isFullCombo,
					is_alljustice: song.isAllJustice,
				};
			});

		const recent = hotListResults
			.filter((song: ChunithmSongResult) => song.musicId !== 0)
			.map((song: ChunithmSongResult) => {
				const rating = ChunitmRating(song.level, song.score);
				return {
					title: song.title,
					artist: song.artist,
					score: song.score,
					rank: getGrade(song.score),
					diff: getDifficultyFromChunithmChart(song.chartId),
					const: song.level,
					rating: Number((rating / 100).toFixed(2)),
					date: Date.now(),
				};
			});

		const formattedData = {
			honor: "",
			name: username,
			rating: Number(((playerRating ?? 0) / 100).toFixed(2)),
			ratingMax: Number(((highestRating ?? 0) / 100).toFixed(2)),
			updatedAt: new Date().toISOString(),
			best: b30,
			recent: recent.slice(0, 10),
		};

		return c.json(formattedData);
	} catch (error) {
		throw rethrowWithMessage("Failed to export B30 data", error);
	}
});

export { ChunithmReiwaRoutes };
