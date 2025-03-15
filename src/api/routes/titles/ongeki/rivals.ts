import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface RivalAddRequest {
	rivalUserId: number;
}

interface RivalRemoveRequest {
	rivalUserId: number;
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

	.post("/add", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const { rivalUserId } = await c.req.json<RivalAddRequest>();

			const result = await db.query(
				`INSERT INTO ongeki_profile_rival (user, rivalUserId)
         VALUES (?, ?)`,
				[userId, rivalUserId]
			);

			if (result.affectedRows === 0) {
				return new Response(null, { status: 400 });
			}
			return new Response(null, { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to add rival", error);
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
				return new Response(null, { status: 404 });
			}
			return new Response(null, { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to remove rival", error);
		}
	})

	.get("/all", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to get rivals", error);
		}
	})

	.get("/mutual", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to get mutual rivals", error);
		}
	})

	.get("/userlookup", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

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
			throw rethrowWithMessage("Failed to get Aime users", error);
		}
	})

	.get("/count", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to get rival count", error);
		}
	});

export { OngekiRivalsRoutes };
