import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/http-wrappers";

import { getUserVersionChunithm } from "../../../version";

interface NameplateCurrentResult {
	nameplateId: number;
	itemId: number;
	user: number;
	itemKind: number;
	stock: number;
	isNew: number;
	name: string;
	sortName: string;
	imagePath: string;
}

interface NameplateUpdateRequest {
	nameplateId: number;
}

interface NameplateAllResult {
	id: number;
	version: number;
	name: string;
	sortName: string;
	imagePath: string;
}

interface NameplateUnlockedItem {
	itemId: number;
}

interface NameplateCurrentResponse {
	results: NameplateCurrentResult[];
}

interface NameplateAllResponse {
	results: NameplateAllResult[];
}

const NameplateRoutes = new Hono()

	.get("/nameplates/current", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
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
			)) as NameplateCurrentResult[];

			return c.json({ results } as NameplateCurrentResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json(rethrowWithMessage("Failed to execute query", error));
		}
	})

	.post("/nameplates/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { nameplateId } = await c.req.json<NameplateUpdateRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET nameplateId = ?
     WHERE user = ?
     AND version = ?`,
				[nameplateId, userId, version]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			console.error("Error updating nameplate:", error);
			return c.json(rethrowWithMessage("Failed to update nameplate", error));
		}
	})
	.get("/nameplates/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			// Get unlocked nameplates
			const unlockedResults = (await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 1 AND user = ?`,
				[userId]
			)) as NameplateUnlockedItem[];

			const unlockedNamePlates = unlockedResults.map((item) => item.itemId);

			// Get all nameplates
			const allNameplates = (await db.query(
				`SELECT nameplateId AS id, version, name, sortName, imagePath 
     FROM daphnis_static_nameplate
     WHERE version=?`,
				[version]
			)) as NameplateAllResult[];

			// Filter unlocked nameplates
			const currentlyUnlockedNamePlates = allNameplates.filter((nameplate) => unlockedNamePlates.includes(nameplate.id));

			return c.json({ results: currentlyUnlockedNamePlates } as NameplateAllResponse);
		} catch (error) {
			console.error("Error fetching nameplates:", error);
			return c.json(rethrowWithMessage("Failed to fetch nameplates", error));
		}
	});
export { NameplateRoutes };
