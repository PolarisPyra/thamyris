import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const ChunithmLeaderboardRoutes = new Hono().get("", async (c) => {
	try {
		const { versions } = c.payload;
		const version = versions.chunithm_version;

		const results = await db.select<DB.ChuniProfileData>(
			`
				SELECT 
					cpd.user,
					cpd.playerRating,
					cpd.userName 
				FROM chuni_profile_data cpd
				WHERE cpd.version = ?
				ORDER BY cpd.playerRating DESC
			`,
			[version]
		);

		return c.json(results);
	} catch (error) {
		throw rethrowWithMessage("Failed to get leaderboard", error);
	}
});

export { ChunithmLeaderboardRoutes };
