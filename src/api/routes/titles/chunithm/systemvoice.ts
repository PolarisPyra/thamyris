import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

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

interface SystemVoiceUpdateResponse {
	success: boolean;
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

	.get("current", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get current systemvoices", error);
		}
	})

	.post("update", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const { voiceId } = await c.req.json<SystemVoiceUpdateRequest>();

			const result = await db.query(
				`UPDATE chuni_profile_data 
     SET voiceId = ?
     WHERE user = ?
     AND version = ?`,
				[voiceId, userId, version]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return c.json({ success: true } as SystemVoiceUpdateResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to update voiceId", error);
		}
	})
	.get("all", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get systemvoices", error);
		}
	});
export { SystemvoiceRoutes };
