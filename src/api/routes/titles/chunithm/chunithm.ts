import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

interface StaticMusicErrorResponse {
	error: string;
}

interface StaticMusicResult {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: string;
	artist: string;
	genre: string;
}

interface PlaylogErrorResponse {
	error: string;
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

interface TeamsErrorResponse {
	error: string;
}

interface TeamResult {
	id: number;
	teamName: string;
}

interface UpdateTeamRequest {
	teamId: number;
}

interface UpdateTeamResponse {
	success: boolean;
	message: string;
}

interface UpdateTeamErrorResponse {
	error: string;
}

interface AddTeamRequest {
	teamName: string;
}

interface AddTeamResponse {
	success: boolean;
	message: string;
	teamId: number;
}

interface AddTeamErrorResponse {
	error: string;
}

interface TeamExistsResult {
	count: number;
}

interface PlaylogResponse {
	results: PlaylogResult[];
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
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = (await db.query(
				`SELECT id, songId, chartId, title, level, artist, genre  
         FROM chuni_static_music
         WHERE version = ?`,
				[version]
			)) as StaticMusicResult[];
			return c.json({ results } as StaticMusicResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch music data" } as StaticMusicErrorResponse, 500);
		}
	})
	.get("/chuni_score_playlog", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = (await db.query(
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
			)) as PlaylogResult[];
			return c.json({ results } as PlaylogResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch playlog" } as PlaylogErrorResponse, 500);
		}
	})
	.get("/teams", async (c): Promise<Response> => {
		try {
			const results = (await db.query(`SELECT * FROM chuni_profile_team`)) as TeamResult[];
			return c.json({ results } as TeamsResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch player team data" } as TeamsErrorResponse, 500);
		}
	})

	.post("/updateteam", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
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
				return c.json({ error: "Team not found" } as UpdateTeamErrorResponse, 404);
			}

			// Update user's team
			await db.query(
				`
                UPDATE 
                chuni_profile_data 
                SET teamId = ? 
                WHERE user = ? 
                AND version = ?`,
				[teamId, userId, version]
			);

			return c.json({ success: true, message: "Team updated successfully" } as UpdateTeamResponse);
		} catch (error) {
			console.error("Error updating team:", error);
			return c.json({ error: "Failed to update team" } as UpdateTeamErrorResponse, 500);
		}
	})

	.post("/addteam", async (c): Promise<Response> => {
		try {
			const { teamName } = await c.req.json<AddTeamRequest>();

			if (!teamName) {
				return c.json({ error: "Team name is required" } as AddTeamErrorResponse, 400);
			}

			// Check if team name already exists
			const existingTeam = await db.query(`SELECT id FROM chuni_profile_team WHERE teamName = ?`, [teamName]);

			if (existingTeam.length > 0) {
				return c.json({ error: "Team name already exists" } as AddTeamErrorResponse, 400);
			}

			const result = await db.query(`INSERT INTO chuni_profile_team (teamName) VALUES (?)`, [teamName]);

			return c.json({
				success: true,
				message: "Team created successfully",
				teamId: result.insertId,
			} as AddTeamResponse);
		} catch {
			return c.json({ error: "Failed to create team" } as AddTeamErrorResponse, 500);
		}
	});

export { ChunithmRoutes };
