import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionOngeki } from "../../../version";

interface RivalAddRequest {
	rivalUserId: number;
}

interface RivalRemoveRequest {
	rivalUserId: number;
}

interface RivalResponse {
	success: boolean;
}

interface RivalErrorResponse {
	error: string;
}

interface RivalsListResponse {
	results: number[];
}

interface MutualRival {
	rivalId: number;
	isMutual: number;
}

interface UserLookupResult {
	id: number;
	username: string;
}

interface RivalCountResponse {
	rivalCount: number;
}

interface MutualRivalsResponse {
	results: MutualRival[];
}

interface UserLookupResponse {
	results: UserLookupResult[];
}

const OngekiRivalsRoutes = new Hono()

	.post("/rivals/add", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const { rivalUserId } = await c.req.json<RivalAddRequest>();

			const result = await db.query(
				`INSERT INTO ongeki_profile_rival (user, rivalUserId)
         VALUES (?, ?)`,
				[userId, rivalUserId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Failed to add rival" } as RivalErrorResponse, 400);
			}
			return c.json({ success: true } as RivalResponse);
		} catch (error) {
			console.error("Error adding rival:", error);
			return c.json({ error: "Failed to add rival" } as RivalErrorResponse, 500);
		}
	})

	.post("/rivals/remove", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const { rivalUserId } = await c.req.json<RivalRemoveRequest>();

			const result = await db.query(
				`DELETE FROM ongeki_profile_rival 
         WHERE user = ? AND rivalUserId = ?`,
				[userId, rivalUserId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Rival not found" } as RivalErrorResponse, 404);
			}
			return c.json({ success: true } as RivalResponse);
		} catch (error) {
			console.error("Error removing rival:", error);
			return c.json({ error: "Failed to remove rival" } as RivalErrorResponse, 500);
		}
	})

	.get("/rivals/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const results = (await db.query(
				`SELECT rivalUserId 
         FROM ongeki_profile_rival
         WHERE user = ?`,
				[userId]
			)) as { rivalUserId: number }[];

			return c.json({
				results: results.map((r) => r.rivalUserId),
			} as RivalsListResponse);
		} catch (error) {
			console.error("Error fetching rivals:", error);
			return c.json({ error: "Failed to fetch rivals" } as RivalErrorResponse, 500);
		}
	})

	.get("/rivals/mutual", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const results = (await db.query(
				`SELECT 
          r1.rivalUserId AS rivalId,
          CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM ongeki_profile_rival AS r2
              WHERE r2.user = r1.rivalUserId 
                AND r2.rivalUserId = r1.user
            ) THEN 1
            ELSE 0
          END AS isMutual
         FROM ongeki_profile_rival AS r1
         WHERE r1.user = ?
         AND EXISTS (
           SELECT 1
           FROM aime_card AS ac
           WHERE ac.user = r1.rivalUserId
         )`,
				[userId]
			)) as MutualRival[];

			return c.json({ results } as MutualRivalsResponse);
		} catch (error) {
			console.error("Error fetching mutual rivals:", error);
			return c.json({ error: "Failed to fetch mutual rivals" } as RivalErrorResponse, 500);
		}
	})

	.get("/rivals/userlookup", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionOngeki(userId);

			const results = (await db.query(
				`SELECT 
          user AS id,
          userName AS username
         FROM ongeki_profile_data 
         WHERE version = ?
         AND user != ?`,
				[version, userId]
			)) as UserLookupResult[];

			return c.json({ results } as UserLookupResponse);
		} catch (error) {
			console.error("Error fetching Aime users:", error);
			return c.json({ error: "Failed to fetch Aime users" } as RivalErrorResponse, 500);
		}
	})

	.get("/rivals/count", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const result = (await db.query(
				`SELECT COUNT(*) AS rivalCount 
         FROM ongeki_profile_rival
         WHERE user = ?`,
				[userId]
			)) as { rivalCount: number }[];

			return c.json({ rivalCount: result[0].rivalCount } as RivalCountResponse);
		} catch (error) {
			console.error("Error counting rivals:", error);
			return c.json({ error: "Failed to count rivals" } as RivalErrorResponse, 500);
		}
	});

export { OngekiRivalsRoutes };
