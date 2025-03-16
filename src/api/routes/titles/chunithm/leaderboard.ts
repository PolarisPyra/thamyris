import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface LeaderboardQueryResult {
	user: number;
	playerRating: number;
	username: string;
}

const ChunithmLeaderboardRoutes = new Hono().get("", async (c) => {
	try {
		const { versions } = c.payload;
		const version = versions.chunithm_version;

		const results = await db.select<LeaderboardQueryResult>(
			`
				SELECT 
					cpd.user,
					cpd.playerRating,
					cpd.userName as username
				FROM chuni_profile_data cpd
				WHERE cpd.version = ?
				ORDER BY cpd.playerRating DESC
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

export { ChunithmLeaderboardRoutes };
