import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionChunithm } from "../../../version";
import { env } from "@/env";

const nameplateRoutes = new Hono()

	.get("/nameplates/current", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				`SELECT p.nameplateId, i.*, n.name, n.sortName, n.imagePath
     FROM chuni_profile_data p
     JOIN chuni_item_item i 
     ON p.nameplateId = i.itemId
     JOIN daphnis_static_nameplate n
     ON p.nameplateId = n.nameplateId
     WHERE p.user = ? 
     AND p.version = ?
     AND i.itemKind = 1
     AND i.user = ?`,
				[userId, version, userId]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch current nameplate" }, 500);
		}
	})

	.post("/nameplates/update", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { nameplateId } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET nameplateId = ?
     WHERE user = ?
     AND version = ?`,
				[nameplateId, userId, version]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found for this version" }, 404);
			}
			return c.json({ success: true });
		} catch (error) {
			console.error("Error updating nameplate:", error);
			return c.json({ error: "Failed to update nameplate" }, 500);
		}
	})
	.get("nameplates/all", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			// Get unlocked nameplates
			const unlockedResults = await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 1 AND user = ?`,
				[userId]
			);

			const unlockedNamePlates = unlockedResults.map((item: { itemId: number }) => item.itemId);

			// Get all nameplates
			const allNameplates = await db.query(
				`SELECT nameplateId AS id, version, name, sortName, imagePath 
     FROM daphnis_static_nameplate
     WHERE version=?`,
				[version]
			);

			// Filter unlocked nameplates
			const currentlyUnlockedNamePlates = allNameplates.filter((nameplate: { id: number }) =>
				unlockedNamePlates.includes(nameplate.id)
			);

			return c.json({ results: currentlyUnlockedNamePlates });
		} catch (error) {
			console.error("Error fetching nameplates:", error);
			return c.json({ error: "Failed to fetch nameplates" }, 500);
		}
	});
export { nameplateRoutes };
