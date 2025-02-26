import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api";
import { env } from "@/env";

import { getUserVersionChunithm } from "../../../version";

const ChunithmRoutes = new Hono()

	.get("/chuni_static_music", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}
			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
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
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
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
	});

export { ChunithmRoutes };
