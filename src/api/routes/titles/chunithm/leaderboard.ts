import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api/db";
import { getUserVersionChunithm } from "@/api/version";
import { env } from "@/env";

const ChunithmLeaderboardRoutes = new Hono().get("/leaderboard", async (c) => {
	try {
		const token = getCookie(c, "auth_token");
		if (!token) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const payload = await verify(token, env.JWT_SECRET);
		const userId = payload.userId;
		const version = await getUserVersionChunithm(userId);

		const results = await db.query(
			`SELECT 
                cpd.user,
                cpd.playerRating,
                cpd.userName as username
            FROM chuni_profile_data cpd
            WHERE cpd.version = ?
            ORDER BY cpd.playerRating DESC`,
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

export { ChunithmLeaderboardRoutes };
