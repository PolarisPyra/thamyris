import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const SystemVoiceRoutes = new Hono()

	.get("current", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.DaphnisStaticSystemVoice>(
				`SELECT p.voiceId, i.*, n.id, n.version, n.systemVoiceId, n.name, n.explainText, n.imagePath
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

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current systemvoice", error);
		}
	})

	.post(
		"update",
		validateJson(
			z.object({
				voiceId: z.number(),
				version: z.number(),
				userId: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { voiceId } = await c.req.json();

				const version = versions.chunithm_version;

				const update = await db.query(
					`
				UPDATE chuni_profile_data 
     		SET voiceId = ?
     		WHERE user = ?
     		AND version = ?`,
					[voiceId, userId, version]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.get("all", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.DaphnisStaticSystemVoice>(
				`
			 SELECT dssv.id, dssv.version, dssv.systemVoiceId, dssv.name, dssv.explainText, dssv.imagePath
       FROM daphnis_static_system_voice dssv
       INNER JOIN chuni_item_item cii ON dssv.systemVoiceId = cii.itemId
       WHERE cii.itemKind = 9 
       AND cii.user = ?
       AND dssv.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get systemvoices", error);
		}
	});
export { SystemVoiceRoutes };
