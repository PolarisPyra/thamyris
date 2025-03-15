import { Hono } from "hono";

import { db } from "@/api/db";
import { OngekiRating, getDifficultyFromOngekiChart, getOngekiGrade } from "@/utils/helpers";

import { getUserVersionOngeki } from "../../../version";

interface OngekiSongResult {
	musicId: number;
	score: number;
	difficultId: number;
	version: string;
	type: string;
	isFullBell?: number;
	isFullCombo?: number;
	isAllBreake?: number;
	title: string;
	artist: string;
	level: number;
	genre: string;
	chartId: number;
}

const OngekiReiwaRoutes = new Hono().get("/reiwa/export", async (c) => {
	try {
		const userId = c.payload.userId;
		const version = await getUserVersionOngeki(userId);

		const usernameResults = await db.query(`SELECT username FROM aime_user WHERE id = ?`, [userId]);
		const username = usernameResults.length > 0 ? usernameResults[0].username : "Player";

		const ratingResults = await db.query(
			`SELECT playerRating, highestRating FROM ongeki_profile_data WHERE user = ? AND version = ?`,
			[userId, version]
		);
		const playerRating = ratingResults.length > 0 ? ratingResults[0].playerRating : 0;
		const highestRating = ratingResults.length > 0 ? ratingResults[0].highestRating : 0;

		// Fetch best 30 songs
		const bestListResults = await db.query(
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
		);

		const newListResults = await db.query(
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
		);

		const hotListResults = await db.query(
			`SELECT 
                r.musicId,
                b.techScoreMax as score,
                r.difficultId,
                r.version,
                r.type,
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

		const b30 = bestListResults
			.filter((song: OngekiSongResult) => song.musicId !== 0)
			.map((song: OngekiSongResult) => {
				const rating = OngekiRating(song.level, song.score);
				return {
					title: song.title,
					artist: song.artist,
					score: song.score,
					rank: getOngekiGrade(song.score),
					diff: getDifficultyFromOngekiChart(song.chartId),
					const: song.level,
					rating: Number((rating / 100).toFixed(2)),
					date: Date.now(),
					is_fullbell: song.isFullBell,
					is_allbreak: song.isAllBreake,
					is_fullcombo: song.isFullCombo,
				};
			});

		const new15 = newListResults
			.filter((song: OngekiSongResult) => song.musicId !== 0)
			.map((song: OngekiSongResult) => {
				const rating = OngekiRating(song.level, song.score);
				return {
					title: song.title,
					artist: song.artist,
					score: song.score,
					rank: getOngekiGrade(song.score),
					diff: getDifficultyFromOngekiChart(song.chartId),
					const: song.level,
					rating: Number((rating / 100).toFixed(2)),
					date: Date.now(),
					is_fullbell: song.isFullBell,
					is_allbreak: song.isAllBreake,
					is_fullcombo: song.isFullCombo,
				};
			});

		const recent = hotListResults
			.filter((song: OngekiSongResult) => song.musicId !== 0)
			.map((song: OngekiSongResult) => {
				const rating = OngekiRating(song.level, song.score);
				return {
					title: song.title,
					artist: song.artist,
					score: song.score,
					rank: getOngekiGrade(song.score),
					diff: getDifficultyFromOngekiChart(song.chartId),
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
			news: new15,
			recent: recent.slice(0, 10),
		};

		return c.json(formattedData);
	} catch (error) {
		console.error("Error exporting B45 data:", error);
		return new Response("error", { status: 500 });
	}
});

export { OngekiReiwaRoutes };
