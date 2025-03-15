import { Hono } from "hono";

import { db } from "@/api/db";
import { getUserVersionOngeki } from "@/api/version";

interface LeaderboardEntry {
	user: number;
	playerRating: number;
	username: string;
}

interface LeaderboardResponseEntry {
	userId: number;
	username: string;
	rating: string;
}

interface LeaderboardResponse {
	results: LeaderboardResponseEntry[];
}

const OngekiLeaderboadRoutes = new Hono().get("/leaderboard", async (c): Promise<Response> => {
	try {
		const userId = c.payload.userId;

		const version = await getUserVersionOngeki(userId);

		const results = (await db.query(
			`SELECT 
                opd.user,
                opd.playerRating,
                opd.userName as username
            FROM ongeki_profile_data opd
            WHERE opd.version = ?
            ORDER BY opd.playerRating DESC`,
			[version]
		)) as LeaderboardEntry[];

		return c.json({
			results: results.map((entry) => ({
				userId: entry.user,
				username: entry.username,
				rating: (entry.playerRating / 100).toFixed(2),
			})),
		} as LeaderboardResponse);
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		return new Response(null, { status: 500 });
	}
});
export { OngekiLeaderboadRoutes };
