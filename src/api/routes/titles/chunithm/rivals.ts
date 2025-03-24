import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { rethrowWithMessage } from "@/api/utils/error";

const RivalsRoutes = new Hono()

	.post(
		"add",
		validateJson(
			z.object({
				favId: z.number().int().positive(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const version = versions.chunithm_version;

				const { favId } = await c.req.json();

				const result = await db.query(
					`
						INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       					VALUES (?, ?, ?, 2)
					`,
					[userId, version, favId]
				);

				if (result.affectedRows === 0) {
					throw new HTTPException(500, { message: "Insert failed" });
				}
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.post(
		"remove",
		validateJson(
			z.object({
				favId: z.number().int().positive(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const version = versions.chunithm_version;

				const { favId } = await c.req.json();

				const result = await db.query(
					`
						DELETE FROM chuni_item_favorite
       					WHERE user = ? 
						  AND version = ? 
						  AND favId = ? 
						  AND favKind = 2
					`,
					[userId, version, favId]
				);

				if (result.affectedRows === 0) {
					throw new HTTPException(500, { message: "Delete failed" });
				}
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to remove favorite", error);
			}
		}
	)

	.get("all", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<{ favId: number }>(
				`
					SELECT favId 
			        FROM chuni_item_favorite
       			    WHERE user = ? 
					  AND version = ? 
					  AND favKind = 2
				`,
				[userId, version]
			);

			return c.json(results.map((r) => r.favId));
		} catch (error) {
			throw rethrowWithMessage("Failed to get rivals", error);
		}
	})

	.get("mutual", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<{ rivalId: number; isMutual: number }>(
				`
					SELECT 
						f1.favId AS rivalId,
						CASE 
							WHEN EXISTS (
								SELECT 1
								FROM chuni_item_favorite AS f2
								WHERE f2.user = f1.favId 
									AND f2.favId = f1.user
									AND f2.version = f1.version
									AND f2.favKind = 2
							) THEN 1
							ELSE 0
						END AS isMutual
					FROM chuni_item_favorite AS f1
					WHERE f1.user = ?
					  AND f1.version = ?
					  AND f1.favKind = 2
					  AND EXISTS (
					    SELECT 1
					    FROM aime_card AS ac
					    WHERE ac.user = f1.favId
					  )
				`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get mutual rivals", error);
		}
	})

	.get("userlookup", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<{ id: number; username: string }>(
				`
					SELECT 
						user AS id, 
						userName AS username
					FROM chuni_profile_data
					WHERE version = ?
					AND user != ?
				`,
				[version, userId]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get user lookup", error);
		}
	})

	.get("count", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const result = await db.select<{ rivalCount: number }>(
				`
					SELECT COUNT(*) AS rivalCount 
					FROM chuni_item_favorite
					WHERE user = ? AND version = ? AND favKind = 2
				`,
				[userId, version]
			);

			return c.json(result[0].rivalCount);
		} catch (error) {
			throw rethrowWithMessage("Failed to count rivals", error);
		}
	});

export { RivalsRoutes };
