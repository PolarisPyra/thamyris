import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionOngeki } from "../../../version";
import { config } from "@/env";

const OngekiRoutes = new Hono()
	.get("/ongeki_score_playlog", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}
			const payload = await verify(token, config.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);

			const results = await db.query(
				`WITH RankedScores AS (
    SELECT 
        csp.id,
        csp.userPlayDate,
        csp.maxCombo,
        csp.isFullCombo,
        csp.playerRating,
        csp.isAllBreak,
        csp.isFullBell,
        csp.techScore,
        csp.battleScore,
        csp.judgeMiss,
        csp.judgeHit,
        csp.judgeBreak,
        csp.judgeCriticalBreak,
        csp.clearStatus,
        csp.cardId1,
        csm.chartId,  
        csm.title, 
        csm.level, 
        csm.genre, 
        csm.artist,
        IF(csp.techScore > LAG(csp.techScore, 1) OVER (ORDER BY csp.userPlayDate), 'Increase', 
           IF(csp.techScore < LAG(csp.techScore, 1) OVER (ORDER BY csp.userPlayDate), 'Decrease', 'Same')) AS techscore_change,
        IF(csp.battleScore > LAG(csp.battleScore, 1) OVER (ORDER BY csp.userPlayDate), 'Increase', 
           IF(csp.battleScore < LAG(csp.battleScore, 1) OVER (ORDER BY csp.userPlayDate), 'Decrease', 'Same')) AS battlescore_change,
        IF(csp.playerRating > LAG(csp.playerRating, 1) OVER (ORDER BY csp.userPlayDate), 'Increase', 
           IF(csp.playerRating < LAG(csp.playerRating, 1) OVER (ORDER BY csp.userPlayDate), 'Decrease', 'Same')) AS rating_change
    FROM 
        ongeki_score_playlog csp
    JOIN ongeki_profile_data d ON csp.user = d.user
    JOIN ongeki_static_music csm 
        ON csp.musicId = csm.songId 
        AND csp.level = csm.chartId 
        AND csm.version = ?
    JOIN aime_card a ON d.user = a.user
    WHERE 
        a.user = ?
        AND d.version = ?
)
SELECT 
    id,
    userPlayDate,
    maxCombo,
    isFullCombo,
    playerRating,
    isAllBreak,
    isFullBell,
    techScore,
    battleScore,
    judgeMiss,
    judgeHit,
    judgeBreak,
    judgeCriticalBreak,
    clearStatus,
    cardId1,
    chartId,  
    title, 
    level, 
    genre, 
    artist,
    techscore_change,
    battlescore_change,
    rating_change
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
	.get("/ongeki_static_music", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}
			const payload = await verify(token, config.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionOngeki(userId);
			const results = await db.query(
				`SELECT id, songId, chartId, title, level, artist, genre  
                FROM ongeki_static_music 
                WHERE version = ?`,
				[version]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch music data" }, 500);
		}
	});
export { OngekiRoutes };
