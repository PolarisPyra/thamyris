import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api";
import { env } from "@/env";

import { getUserVersionChunithm } from "../../../version";

const systemvoiceRoutes = new Hono()

	.get("/systemvoice/current", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				`SELECT p.voiceId, i.*, n.name,  n.imagePath
     FROM chuni_profile_data p
     JOIN chuni_item_item i 
     ON p.voiceId = i.itemId
     JOIN daphnis_static_system_voice n
     ON p.voiceId = n.systemVoiceId
     WHERE p.user = ? 
     AND p.version = ?
     AND i.itemKind = 9
     AND i.user = ?`,
				[userId, version, userId]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch current system voice" }, 500);
		}
	})

	.post("/systemvoice/update", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { voiceId } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET voiceId = ?
     WHERE user = ?
     AND version = ?`,
				[voiceId, userId, version]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found for this version" }, 404);
			}
			return c.json({ success: true });
		} catch (error) {
			console.error("Error updating voiceId:", error);
			return c.json({ error: "Failed to update voiceId" }, 500);
		}
	})
	.get("/systemvoice/all", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			// Get unlocked systemvoices
			const unlockedResults = await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 9 AND user = ?`,
				[userId]
			);

			const unlockedSystemvoices = unlockedResults.map((item: { itemId: number }) => item.itemId);

			// Get all systemvoices
			const allSystemvoices = await db.query(
				`SELECT systemVoiceId AS id, version, name, imagePath 
     FROM daphnis_static_system_voice
     WHERE version=?`,
				[version]
			);

			// Filter unlocked systemvoices
			const currentlyUnlockedSystemvoices = allSystemvoices.filter((systemvoice: { id: number }) =>
				unlockedSystemvoices.includes(systemvoice.id)
			);

			return c.json({ results: currentlyUnlockedSystemvoices });
		} catch (error) {
			console.error("Error fetching systemvoices:", error);
			return c.json({ error: "Failed to fetch systemvoices" }, 500);
		}
	});
export { systemvoiceRoutes };
