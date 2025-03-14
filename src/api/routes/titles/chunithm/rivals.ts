import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

interface AddRivalRequest {
	favId: number;
}

interface AddRivalResponse {
	success: boolean;
}

interface AddRivalErrorResponse {
	error: string;
}

interface RemoveRivalRequest {
	favId: number;
}

interface RemoveRivalResponse {
	success: boolean;
}

interface RemoveRivalErrorResponse {
	error: string;
}

interface RivalsAllResponse {
	results: number[];
}

interface RivalsAllErrorResponse {
	error: string;
}

interface RivalMutualEntry {
	rivalId: number;
	isMutual: number;
}

interface RivalsMutualErrorResponse {
	error: string;
}

interface UserLookupEntry {
	id: number;
	username: string;
}

interface UserLookupErrorResponse {
	error: string;
}

interface RivalsCountResponse {
	rivalCount: number;
}

interface RivalsCountErrorResponse {
	error: string;
}

interface RivalsMutualResponse {
	results: RivalMutualEntry[];
}

interface UserLookupResponse {
	results: UserLookupEntry[];
}

const RivalsRoutes = new Hono()

	.post("/rivals/add", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { favId } = await c.req.json<AddRivalRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       VALUES (?, ?, ?, 2)`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Failed to add favorite" } as AddRivalErrorResponse, 400);
			}
			return c.json({ success: true } as AddRivalResponse);
		} catch (error) {
			console.error("Error adding favorite:", error);
			return c.json({ error: "Failed to add favorite" } as AddRivalErrorResponse, 500);
		}
	})

	.post("/rivals/remove", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { favId } = await c.req.json<RemoveRivalRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`DELETE FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favId = ? AND favKind = 2`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Favorite not found" } as RemoveRivalErrorResponse, 404);
			}
			return c.json({ success: true } as RemoveRivalResponse);
		} catch (error) {
			console.error("Error removing favorite:", error);
			return c.json({ error: "Failed to remove favorite" } as RemoveRivalErrorResponse, 500);
		}
	})

	.get("/rivals/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				`SELECT favId 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ results: results.map((r: { favId: number }) => r.favId) } as RivalsAllResponse);
		} catch (error) {
			console.error("Error fetching rivals:", error);
			return c.json({ error: "Failed to fetch rivals" } as RivalsAllErrorResponse, 500);
		}
	})

	.get("/rivals/mutual", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
				`SELECT 
          f1.favId AS rivalId,
          CASE 
              WHEN EXISTS (
                  SELECT 1
                  FROM chuni_item_favorite AS f2
                  WHERE f2.user = f1.favId 
                    AND f2.favId = f1.user
                    AND f2.version = f1.version
                    AND f2.favKind = 2
              ) THEN 1
              ELSE 0
          END AS isMutual
      FROM chuni_item_favorite AS f1
      WHERE f1.user = ?
        AND f1.version = ?
        AND f1.favKind = 2
        AND EXISTS (
          SELECT 1
          FROM aime_card AS ac
          WHERE ac.user = f1.favId
        )`,
				[userId, version]
			)) as RivalMutualEntry[];

			return c.json({ results } as RivalsMutualResponse);
		} catch (error) {
			console.error("Error fetching mutual rivals:", error);
			return c.json({ error: "Failed to fetch mutual rivals" } as RivalsMutualErrorResponse, 500);
		}
	})

	.get("/rivals/userlookup", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
				` SELECT 
          user AS id, 
          userName AS username
      FROM chuni_profile_data
      WHERE version = ?
      AND user != ?`,
				[version, userId]
			)) as UserLookupEntry[];

			return c.json({ results } as UserLookupResponse);
		} catch (error) {
			console.error("Error fetching Aime users:", error);
			return c.json({ error: "Failed to fetch Aime users" } as UserLookupErrorResponse, 500);
		}
	})

	.get("/rivals/count", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`SELECT COUNT(*) AS rivalCount 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ rivalCount: result[0].rivalCount } as RivalsCountResponse);
		} catch (error) {
			console.error("Error counting rivals:", error);
			return c.json({ error: "Failed to count rivals" } as RivalsCountErrorResponse, 500);
		}
	});
export { RivalsRoutes };
