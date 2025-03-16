import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface StaticMusicResult {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: string;
	artist: string;
	genre: string;
}

interface PlaylogResult {
	id: number;
	maxCombo: number;
	isFullCombo: number;
	userPlayDate: string;
	playerRating: number;
	isAllJustice: number;
	score: number;
	judgeHeaven: number;
	judgeGuilty: number;
	judgeJustice: number;
	judgeAttack: number;
	judgeCritical: number;
	isClear: number;
	skillId: number;
	isNewRecord: number;
	chartId: number;
	title: string;
	level: string;
	genre: string;
	jacketPath: string;
	artist: string;
	score_change: string;
	rating_change: string;
}

interface TeamResult {
	id: number;
	teamName: string;
}

interface UpdateTeamRequest {
	teamId: number;
}

interface AddTeamRequest {
	teamName: string;
}

interface AddTeamResponse {
	success: boolean;
	teamId: number;
}

interface TeamExistsResult {
	count: number;
}

interface StaticMusicResponse {
	results: StaticMusicResult[];
}

interface TeamsResponse {
	results: TeamResult[];
}

const ChunithmRoutes = new Hono()
	.get("/chuni_static_music", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = (await db.query(
				`SELECT id, songId, chartId, title, level, artist, genre  
         FROM chuni_static_music
         WHERE version = ?`,
				[version]
			)) as StaticMusicResult[];
			return c.json({ results } as StaticMusicResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/chuni_score_playlog", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<PlaylogResult>(
				`
				WITH RankedScores AS (
				SELECT
					csp.id,
					csp.maxCombo,
					csp.isFullCombo,
					csp.userPlayDate,
					csp.playerRating,
					csp.isAllJustice,
					csp.score,
					csp.judgeHeaven,
					csp.judgeGuilty,
					csp.judgeJustice,
					csp.judgeAttack,
					csp.judgeCritical,
					csp.isClear,
					csp.skillId,
					csp.isNewRecord,
					csm.chartId,  
					csm.title,
					csm.level,
					csm.genre,
					csm.jacketPath,
					csm.artist,
					IF(csp.score > LAG(csp.score, 1) OVER (ORDER BY csp.userPlayDate), 'Increase',
					IF(csp.score < LAG(csp.score, 1) OVER (ORDER BY csp.userPlayDate), 'Decrease', 'Same')) AS score_change,
					IF(csp.playerRating > LAG(csp.playerRating, 1) OVER (ORDER BY csp.userPlayDate), 'Increase',
					IF(csp.playerRating < LAG(csp.playerRating, 1) OVER (ORDER BY csp.userPlayDate), 'Decrease', 'Same')) AS rating_change
				FROM
					chuni_score_playlog csp
					JOIN chuni_profile_data d ON csp.user = d.user
					JOIN chuni_static_music csm ON csp.musicId = csm.songId
					AND csp.level = csm.chartId
					AND csm.version = ?
					JOIN aime_card a ON d.user = a.user
				WHERE
					a.user = ? AND d.version = ?
				)
				SELECT
				id,
				maxCombo,
				isFullCombo,
				userPlayDate,
				playerRating,
				isAllJustice,
				score,
				judgeHeaven,
				judgeGuilty,
				judgeJustice,
				judgeAttack,
				judgeCritical,
				isClear,
				skillId,
				isNewRecord,
				chartId,  
				title,
				level,
				genre,
				jacketPath,
				artist,
				score_change,
				rating_change,
				playerRating
				FROM
				RankedScores
				ORDER BY
				userPlayDate DESC;
				`,
				[version, userId, version]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to fetch chunithm scores", error);
		}
	})
	.get("/teams", async (c): Promise<Response> => {
		try {
			const results = (await db.query(`SELECT * FROM chuni_profile_team`)) as TeamResult[];
			return c.json({ results } as TeamsResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to get teams", error);
		}
	})

	.post("/updateteam", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const { teamId } = await c.req.json<UpdateTeamRequest>();

			// Validate teamId exists
			const teamExists = (await db.query(
				`
                SELECT COUNT(*) as count 
                FROM chuni_profile_team 
                WHERE id = ?`,
				[teamId]
			)) as TeamExistsResult[];

			if (teamExists[0].count === 0) {
				return new Response(null, { status: 404 });
			}

			await db.query(
				`
                UPDATE 
                chuni_profile_data 
                SET teamId = ? 
                WHERE user = ? 
                AND version = ?`,
				[teamId, userId, version]
			);

			return new Response("success", { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to update team", error);
		}
	})

	.post("/addteam", async (c): Promise<Response> => {
		try {
			const { teamName } = await c.req.json<AddTeamRequest>();

			if (!teamName) {
				return new Response("error", { status: 400 });
			}

			// Check if team name already exists
			const existingTeam = await db.query(`SELECT id FROM chuni_profile_team WHERE teamName = ?`, [teamName]);

			if (existingTeam.length > 0) {
				return new Response("team already added", { status: 409 });
			}

			const result = await db.query(`INSERT INTO chuni_profile_team (teamName) VALUES (?)`, [teamName]);

			return c.json({
				success: true,
				teamId: result.insertId,
			} as AddTeamResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to add team", error);
		}
	});

export { ChunithmRoutes };
