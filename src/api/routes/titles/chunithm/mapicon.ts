import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const MapIconRoutes = new Hono()

	.get("current", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.DaphnisStaticMapIcon>(
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

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current map icon", error);
		}
	})
	.post(
		"update",
		validateJson(
			z.object({
				mapIconId: z.number(),
				version: z.number(),
				userId: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { mapIconId } = await c.req.json();

				const version = versions.chunithm_version;

				const update = await db.query(
					`
				UPDATE chuni_profile_data 
				SET mapIconId = ? 
				WHERE user = ? 
				AND version = ?`,
					[mapIconId, userId, version]
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

			const results = await db.select<DB.DaphnisStaticMapIcon>(
				`
			 SELECT dsm.mapIconId, dsm.version, dsm.name, dsm.sortName, dsm.imagePath
       FROM daphnis_static_map_icon dsm
       INNER JOIN chuni_item_item cii ON dsm.mapIconId = cii.itemId
       WHERE cii.itemKind = 8 
       AND cii.user = ?
      AND dsm.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current map icon", error);
		}
	});

export { MapIconRoutes };
