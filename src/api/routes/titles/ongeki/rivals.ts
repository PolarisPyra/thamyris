import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { rethrowWithMessage } from "@/api/utils/error";

const OngekiRivalsRoutes = new Hono()
	.post(
		"add",
		validateJson(
			z.object({
				rivalUserId: z.number().int().positive(),
			})
		),
		async (c) => {
			try {
				const userId = c.payload.userId;
				const { rivalUserId } = await c.req.json();

				const result = await db.query(
					`
						INSERT INTO ongeki_profile_rival (user, rivalUserId)
						VALUES (?, ?)
					`,
					[userId, rivalUserId]
				);
				if (result.affectedRows === 0) {
					throw new HTTPException(500, { message: "Insert failed" });
				}
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to add rival", error);
			}
		}
	)

	.post(
		"remove",
		validateJson(
			z.object({
				rivalUserId: z.number().int().positive(),
			})
		),
		async (c) => {
			try {
				const userId = c.payload.userId;
				const { rivalUserId } = await c.req.json();

				const result = await db.query(
					`
						DELETE FROM ongeki_profile_rival 
         				WHERE user = ? AND rivalUserId = ?
					`,
					[userId, rivalUserId]
				);
				if (result.affectedRows === 0) {
					throw new HTTPException(500, { message: "Delete failed" });
				}
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to remove rival", error);
			}
		}
	)

	.get("all", async (c) => {
		try {
			const userId = c.payload.userId;

			const results = await db.select<{ rivalUserId: number }>(
				`
					SELECT rivalUserId 
         			FROM ongeki_profile_rival
         			WHERE user = ?
				`,
				[userId]
			);

			return c.json(results.map((row) => row.rivalUserId));
		} catch (error) {
			throw rethrowWithMessage("Failed to get rivals", error);
		}
	})

	.get("mutual", async (c) => {
		try {
			const userId = c.payload.userId;

			const results = await db.select<{
				rivalId: number;
				isMutual: number;
			}>(
				`
					SELECT 
						r1.rivalUserId AS rivalId,
						CASE 
							WHEN EXISTS (
							SELECT 1 
							FROM ongeki_profile_rival AS r2
							WHERE r2.user = r1.rivalUserId 
								AND r2.rivalUserId = r1.user
							) THEN 1
							ELSE 0
						END AS isMutual
					FROM ongeki_profile_rival AS r1
					WHERE r1.user = ?
						AND EXISTS (
							SELECT 1
							FROM aime_card AS ac
							WHERE ac.user = r1.rivalUserId
						)
				`,
				[userId]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get mutual rivals", error);
		}
	})

	.get("userlookup", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

			const results = await db.select<{ id: number; username: string }>(
				`
					SELECT 
          				user AS id,
          				userName AS username
         			FROM ongeki_profile_data 
         			WHERE version = ?
         			AND user != ?
				`,
				[version, userId]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get Aime users", error);
		}
	})

	.get("count", async (c) => {
		try {
			const userId = c.payload.userId;

			const result = await db.select<{ rivalCount: number }>(
				`SELECT COUNT(*) AS rivalCount 
         FROM ongeki_profile_rival
         WHERE user = ?`,
				[userId]
			);

			return c.json(result[0].rivalCount);
		} catch (error) {
			throw rethrowWithMessage("Failed to get rival count", error);
		}
	});

export { OngekiRivalsRoutes };
