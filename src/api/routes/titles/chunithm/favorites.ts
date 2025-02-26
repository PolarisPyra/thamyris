import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api/db";
import { env } from "@/env";

import { getUserVersionChunithm } from "../../../version";

const favoritesRoutes = new Hono()

	.post("/favorites/add", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { favId } = await c.req.json();
			const supportedVersionNumber = 17;

			const result = await db.query(
				`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       VALUES (?, ?, ?, 1)`,
				[userId, supportedVersionNumber, favId]
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

	.post("/favorites/remove", async (c) => {
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
       WHERE user = ? AND version = ? AND favId = ? AND favKind = 1`,
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

	.get("/favorites/all", async (c) => {
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
       WHERE user = ? AND version = ? AND favKind = 1`,
				[userId, version]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error fetching favorites:", error);
			return c.json({ error: "Failed to fetch favorites" }, 500);
		}
	});
export { favoritesRoutes };
