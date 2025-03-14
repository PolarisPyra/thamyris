import { Hono } from "hono";

import { db } from "@/api/db";
import { getUserVersionChunithm } from "@/api/version";

interface LeaderboardErrorResponse {
	error: string;
}

interface LeaderboardEntry {
	userId: number;
	username: string;
	rating: string;
}

interface LeaderboardQueryResult {
	user: number;
	playerRating: number;
	username: string;
}

interface LeaderboardResponse {
	results: LeaderboardEntry[];
}

const ChunithmLeaderboardRoutes = new Hono().get("/leaderboard", async (c): Promise<Response> => {
	try {
		const userId = c.payload.userId;

		const version = await getUserVersionChunithm(userId);

		const results = (await db.query(
			`SELECT 
                cpd.user,
                cpd.playerRating,
                cpd.userName as username
            FROM chuni_profile_data cpd
            WHERE cpd.version = ?
            ORDER BY cpd.playerRating DESC`,
			[version]
		)) as LeaderboardQueryResult[];

		return c.json({
			results: results.map((entry) => ({
				userId: entry.user,
				username: entry.username,
				rating: (entry.playerRating / 100).toFixed(2),
			})),
		} as LeaderboardResponse);
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		return c.json({ error: "Failed to fetch leaderboard" } as LeaderboardErrorResponse, 500);
	}
});

export { ChunithmLeaderboardRoutes };
