import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const OngekiRoutes = new Hono()
	.get("ongeki_score_playlog", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiScorePlaylog>(
				`
                WITH RankedScores AS (
                    SELECT 
                        csp.id,
                        csp.userPlayDate,
                        csp.maxCombo,
                        csp.isFullCombo,
                        csp.platinumScore,
                        csp.platinumScoreMax, 
                        csp.platinumScoreStar,
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
                    rating_change,
                    platinumScore,
                    platinumScoreMax,
                    platinumScoreStar
                FROM 
                    RankedScores
                ORDER BY 
                    userPlayDate DESC;
                    `,
				[version, userId, version]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to fetch ongeki playlog", error);
		}
	})
	.get("ongeki_static_music", async (c) => {
		try {
			const { versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<DB.OngekiStaticMusic>(
				`SELECT id, songId, chartId, title, level, artist, genre  
       FROM ongeki_static_music
       WHERE version = ?`,
				[version]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get static music", error);
		}
	});
export { OngekiRoutes };
