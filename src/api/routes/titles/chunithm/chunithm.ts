import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const ChunithmRoutes = new Hono()

	.get("chuni_static_music", async (c) => {
		try {
			const { versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniStaticMusic>(
				`SELECT id, songId, chartId, title, level, artist, genre, jacketPath  
       FROM chuni_static_music
       WHERE version = ?`,
				[version]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get static music", error);
		}
	})

	.get("chuni_score_playlog", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniScorePlaylog>(
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
			throw rethrowWithMessage("Failed to get static music", error);
		}
	});

export { ChunithmRoutes };
