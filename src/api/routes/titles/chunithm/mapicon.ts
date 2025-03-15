import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

interface MapIconCurrentResult {
	mapIconId: number;
	itemId: number;
	user: number;
	itemKind: number;
	stock: number;
	isNew: number;
	name: string;
	sortName: string;
	imagePath: string;
}

interface MapIconUpdateRequest {
	mapIconId: number;
}

interface MapIconAllResult {
	id: number;
	version: number;
	name: string;
	sortName: string;
	imagePath: string;
}

interface MapIconUnlockedItem {
	itemId: number;
}

interface MapIconCurrentResponse {
	results: MapIconCurrentResult[];
}

interface MapIconAllResponse {
	results: MapIconAllResult[];
}

const MapIconRoutes = new Hono()

	.get("/mapicon/current", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
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
			)) as MapIconCurrentResult[];

			return c.json({ results } as MapIconCurrentResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return new Response("error", { status: 500 });
		}
	})

	.post("/mapicon/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { mapIconId } = await c.req.json<MapIconUpdateRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET mapIconId = ?
     WHERE user = ?
     AND version = ?`,
				[mapIconId, userId, version]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			console.error("Error updating map icon:", error);
			return new Response("error", { status: 500 });
		}
	})
	.get("/mapicon/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			// Get unlocked mapicons
			const unlockedResults = (await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 8 AND user = ?`,
				[userId]
			)) as MapIconUnlockedItem[];

			const unlockedMapicons = unlockedResults.map((item) => item.itemId);

			// Get all mapicons
			const allMapicons = (await db.query(
				`SELECT mapIconId AS id, version, name, sortName, imagePath 
     FROM daphnis_static_map_icon
     WHERE version=?`,
				[version]
			)) as MapIconAllResult[];

			// Filter unlocked mapicons
			const currentlyUnlockedMapicons = allMapicons.filter((mapicon) => unlockedMapicons.includes(mapicon.id));

			return c.json({ results: currentlyUnlockedMapicons } as MapIconAllResponse);
		} catch (error) {
			console.error("Error fetching mapicons:", error);
			return new Response("error", { status: 500 });
		}
	});
export { MapIconRoutes };
