import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface AddRivalRequest {
	favId: number;
}

interface RemoveRivalRequest {
	favId: number;
}

interface RivalsAllResponse {
	results: number[];
}

interface RivalMutualEntry {
	rivalId: number;
	isMutual: number;
}

interface UserLookupEntry {
	id: number;
	username: string;
}

interface RivalsCountResponse {
	rivalCount: number;
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
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const { favId } = await c.req.json<AddRivalRequest>();

			const result = await db.query(
				`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       VALUES (?, ?, ?, 2)`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to add favorite", error);
		}
	})

	.post("/rivals/remove", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const { favId } = await c.req.json<RemoveRivalRequest>();

			const result = await db.query(
				`DELETE FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favId = ? AND favKind = 2`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to remove favorite", error);
		}
	})

	.get("/rivals/all", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.query(
				`SELECT favId 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ results: results.map((r: { favId: number }) => r.favId) } as RivalsAllResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rivals", error);
		}
	})

	.get("/rivals/mutual", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get mutual rivals", error);
		}
	})

	.get("/rivals/userlookup", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get user lookup", error);
		}
	})

	.get("/rivals/count", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const result = await db.query(
				`SELECT COUNT(*) AS rivalCount 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ rivalCount: result[0].rivalCount } as RivalsCountResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to count rivals", error);
		}
	});
export { RivalsRoutes };
