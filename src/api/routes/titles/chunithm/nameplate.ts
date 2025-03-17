import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const NameplateRoutes = new Hono()

	.get("current", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.DaphnisStaticMapIcon>(
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

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current nameplate", error);
		}
	})
	.post(
		"update",
		validateJson(
			z.object({
				nameplateId: z.number(),
				version: z.number(),
				userId: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { nameplateId } = await c.req.json();

				const version = versions.chunithm_version;

				const update = await db.query(
					`
				UPDATE chuni_profile_data 
     		SET nameplateId = ?
     		WHERE user = ?
     		AND version = ?`,
					[nameplateId, userId, version]
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

			const results = await db.select<DB.DaphnisStaticNameplate>(
				`
			 SELECT dsn.nameplateId, dsn.version, dsn.name, dsn.sortName, dsn.imagePath
       FROM daphnis_static_nameplate dsn
       INNER JOIN chuni_item_item cii ON dsn.nameplateId = cii.itemId
       WHERE cii.itemKind = 1 
       AND cii.user = ?
       AND dsn.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get nameplates", error);
		}
	});

export { NameplateRoutes };
