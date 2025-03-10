import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

const ChunithmRoutes = new Hono()
	.get("/chuni_static_music", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = await db.query(
				`SELECT id, songId, chartId, title, level, artist, genre  
         FROM chuni_static_music
         WHERE version = ?`,
				[version]
			);
			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch music data" }, 500);
		}
	})
	.get("/chuni_score_playlog", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = await db.query(
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
			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch playlog" }, 500);
		}
	})
	.get("/teams", async (c) => {
		try {
			const results = await db.query(`SELECT * FROM chuni_profile_team`);
			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch player team data" }, 500);
		}
	})

	.post("/updateteam", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const { teamId } = await c.req.json();

			// Validate teamId exists
			const teamExists = await db.query(
				`
                SELECT COUNT(*) as count 
                FROM chuni_profile_team 
                WHERE id = ?`,
				[teamId]
			);

			if (teamExists[0].count === 0) {
				return c.json({ error: "Team not found" }, 404);
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

			return c.json({ success: true, message: "Team updated successfully" });
		} catch (error) {
			console.error("Error updating team:", error);
			return c.json({ error: "Failed to update team" }, 500);
		}
	});

export { ChunithmRoutes };
