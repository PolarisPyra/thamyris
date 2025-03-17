import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const OngekiLeaderboardRoutes = new Hono().get("", async (c) => {
	try {
		const { versions } = c.payload;
		const version = versions.ongeki_version;

		const results = await db.select<DB.OngekiProfileData>(
			`
				SELECT 
					opd.user,
					opd.playerRating,
					opd.userName
				FROM ongeki_profile_data opd
				WHERE opd.version = ?
				ORDER BY opd.playerRating DESC
			`,
			[version]
		);

		return c.json(results);
	} catch (error) {
		throw rethrowWithMessage("Failed to get leaderboard", error);
	}
});
export { OngekiLeaderboardRoutes };
