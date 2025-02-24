import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionChunithm } from "../../../version";
import { env } from "@/env";

const rivalsRoutes = new Hono()

	.post("/rivals/add", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { favId } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       VALUES (?, ?, ?, 2)`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Failed to add favorite" }, 400);
			}
			return c.json({ success: true });
		} catch (error) {
			console.error("Error adding favorite:", error);
			return c.json({ error: "Failed to add favorite" }, 500);
		}
	})

	.post("/rivals/remove", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { favId } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`DELETE FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favId = ? AND favKind = 2`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Favorite not found" }, 404);
			}
			return c.json({ success: true });
		} catch (error) {
			console.error("Error removing favorite:", error);
			return c.json({ error: "Failed to remove favorite" }, 500);
		}
	})

	.get("/rivals/all", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				`SELECT favId 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ results: results.map((r: { favId: number }) => r.favId) });
		} catch (error) {
			console.error("Error fetching rivals:", error);
			return c.json({ error: "Failed to fetch rivals" }, 500);
		}
	})

	.get("/rivals/mutual", async (c) => {
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
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error fetching mutual rivals:", error);
			return c.json({ error: "Failed to fetch mutual rivals" }, 500);
		}
	})

	.get("/rivals/userlookup", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				` SELECT 
          user AS id, 
          userName AS username
      FROM chuni_profile_data
      WHERE version = ?
      AND user != ?`,
				[version, userId]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error fetching Aime users:", error);
			return c.json({ error: "Failed to fetch Aime users" }, 500);
		}
	})

	.get("/rivals/count", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`SELECT COUNT(*) AS rivalCount 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 2`,
				[userId, version]
			);

			return c.json({ rivalCount: result[0].rivalCount });
		} catch (error) {
			console.error("Error counting rivals:", error);
			return c.json({ error: "Failed to count rivals" }, 500);
		}
	});
export { rivalsRoutes };
