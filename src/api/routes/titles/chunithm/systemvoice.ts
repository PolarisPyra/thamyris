import { Hono } from "hono";

import { db } from "@/api/db";
import { notFoundWithMessage, successWithMessage } from "@/api/utils/http-wrappers";

import { getUserVersionChunithm } from "../../../version";

interface SystemVoiceItem {
	voiceId: number;
	itemId: number;
	itemKind: number;
	user: number;
	name: string;
	imagePath: string;
	[key: string]: unknown;
}

interface SystemVoiceUpdateRequest {
	voiceId: number;
}

interface SystemVoiceUnlockedItem {
	itemId: number;
}

interface SystemVoiceAllItem {
	id: number;
	version: number;
	name: string;
	imagePath: string;
}

interface SystemVoiceAllResponse {
	results: SystemVoiceAllItem[];
}

interface SystemVoiceCurrentResponse {
	results: SystemVoiceItem[];
}

const SystemvoiceRoutes = new Hono()

	.get("/systemvoice/current", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
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
			)) as SystemVoiceItem[];

			return c.json({ results } as SystemVoiceCurrentResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json(notFoundWithMessage("Failed to fetch current systemvoices", error));
		}
	})

	.post("/systemvoice/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { voiceId } = await c.req.json<SystemVoiceUpdateRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET voiceId = ?
     WHERE user = ?
     AND version = ?`,
				[voiceId, userId, version]
			);

			if (result.affectedRows === 0) {
				return c.json(notFoundWithMessage("Failed to update systemvoice", result));
			}
			return c.json(successWithMessage("Successfully updated systemvoice", { success: true }));
		} catch (error) {
			console.error("Error updating voiceId:", error);
			return c.json(notFoundWithMessage("Failed to update systemvoice", error));
		}
	})
	.get("/systemvoice/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			// Get unlocked systemvoices
			const unlockedResults = (await db.query(
				`SELECT itemId 
     FROM chuni_item_item 
     WHERE itemKind = 9 AND user = ?`,
				[userId]
			)) as SystemVoiceUnlockedItem[];

			const unlockedSystemvoices = unlockedResults.map((item) => item.itemId);

			// Get all systemvoices
			const allSystemvoices = (await db.query(
				`SELECT systemVoiceId AS id, version, name, imagePath 
     FROM daphnis_static_system_voice
     WHERE version=?`,
				[version]
			)) as SystemVoiceAllItem[];

			// Filter unlocked systemvoices
			const currentlyUnlockedSystemvoices = allSystemvoices.filter((systemvoice) =>
				unlockedSystemvoices.includes(systemvoice.id)
			);

			return c.json({ results: currentlyUnlockedSystemvoices } as SystemVoiceAllResponse);
		} catch (error) {
			console.error("Error fetching systemvoices:", error);
			return c.json(notFoundWithMessage("Failed to fetch systemvoices", error));
		}
	});
export { SystemvoiceRoutes };
