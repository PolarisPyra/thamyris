import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

interface favId {
	favId: number;
}

const FavoritesRoutes = new Hono()

	.post(
		"add",
		validateJson(
			z.object({
				user: z.number(),
				version: z.number(),
				favId: z.number(),
				favKind: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { favId } = await c.req.json<favId>();

				const version = versions.chunithm_version;

				const result = await db.query(
					`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       		 VALUES (?, ?, ?, 1)`,
					[userId, version, favId]
				);

				return c.json(result);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.post(
		"remove",
		validateJson(
			z.object({
				user: z.number(),
				version: z.number(),
				favId: z.number(),
				favKind: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { favId } = await c.req.json<favId>();

				const version = versions.chunithm_version;

				const result = await db.query(
					`DELETE FROM chuni_item_favorite
       		 WHERE user = ? AND version = ? AND favId = ? AND favKind = 1`,
					[userId, version, favId]
				);

				return c.json(result);
			} catch (error) {
				throw rethrowWithMessage("Failed to remove favorite", error);
			}
		}
	)

	.get("all", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniItemFavorite>(
				`SELECT favId FROM chuni_item_favorite
         WHERE user = ? AND version = ? AND favKind = 1`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get favorites", error);
		}
	});

export { FavoritesRoutes };
