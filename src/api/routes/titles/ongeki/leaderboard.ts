import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface LeaderboardEntry {
	user: number;
	playerRating: number;
	username: string;
}

const OngekiLeaderboadRoutes = new Hono().get("/leaderboard", async (c) => {
	try {
		const { versions } = c.payload;
		const version = versions.ongeki_version;

		const results = await db.select<LeaderboardEntry>(
			`
				SELECT 
					opd.user,
					opd.playerRating,
					opd.userName as username
				FROM ongeki_profile_data opd
				WHERE opd.version = ?
				ORDER BY opd.playerRating DESC
			`,
			[version]
		);

		return c.json({
			results: results.map((entry) => ({
				userId: entry.user,
				username: entry.username,
				rating: (entry.playerRating / 100).toFixed(2),
			})),
		});
	} catch (error) {
		throw rethrowWithMessage("Failed to get leaderboard", error);
	}
});
export { OngekiLeaderboadRoutes };
