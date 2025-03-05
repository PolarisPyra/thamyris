import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

const MapIconRoutes = new Hono()

	.get("/mapicon/current", async (c) => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = await db.query(
				`SELECT p.mapIconId, i.*, n.name, n.sortName, n.imagePath
     FROM chuni_profile_data p
     JOIN chuni_item_item i
     ON p.mapIconId = i.itemId
     JOIN daphnis_static_map_icon n
     ON p.mapIconId = n.mapIconId
     WHERE p.user = ? 
     AND p.version = ?
     AND i.itemKind = 8
     AND i.user = ?`,
				[userId, version, userId]
			);

			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch current map icon" }, 500);
		}
	})

	.post("/mapicon/update", async (c) => {
		try {
			const userId = c.payload.userId;

			const { mapIconId } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET mapIconId = ?
     WHERE user = ?
     AND version = ?`,
				[mapIconId, userId, version]
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
	.get("/mapicon/all", async (c) => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			// Get unlocked mapicons
			const unlockedResults = await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 8 AND user = ?`,
				[userId]
			);

			const unlockedMapicons = unlockedResults.map((item: { itemId: number }) => item.itemId);

			// Get all mapicons
			const allMapicons = await db.query(
				`SELECT mapIconId AS id, version, name, sortName, imagePath 
     FROM daphnis_static_map_icon
     WHERE version=?`,
				[version]
			);

			// Filter unlocked mapicons
			const currentlyUnlockedMapicons = allMapicons.filter((mapicon: { id: number }) =>
				unlockedMapicons.includes(mapicon.id)
			);

			return c.json({ results: currentlyUnlockedMapicons });
		} catch (error) {
			console.error("Error fetching mapicons:", error);
			return c.json({ error: "Failed to fetch mapicons" }, 500);
		}
	});
export { MapIconRoutes };
