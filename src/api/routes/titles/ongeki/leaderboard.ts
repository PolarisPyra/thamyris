/* eslint-disable @typescript-eslint/no-explicit-any */
// we will eventually need to type this out properly
import { Hono } from "hono";

import { db } from "@/api/db";
import { getUserVersionOngeki } from "@/api/version";

const OngekiLeaderboadRoutes = new Hono().get("/leaderboard", async (c) => {
	try {
		const userId = c.payload.userId;

		const version = await getUserVersionOngeki(userId);

		const results = await db.query(
			`SELECT 
                opd.user,
                opd.playerRating,
                opd.userName as username
            FROM ongeki_profile_data opd
            WHERE opd.version = ?
            ORDER BY opd.playerRating DESC`,
			[version]
		);

		return c.json({
			results: results.map((entry: any) => ({
				userId: entry.user,
				username: entry.username,
				rating: (entry.playerRating / 100).toFixed(2),
			})),
		});
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		return c.json({ error: "Failed to fetch leaderboard" }, 500);
	}
});
export { OngekiLeaderboadRoutes };
