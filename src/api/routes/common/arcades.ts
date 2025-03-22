import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { UserRole } from "@/api/types/enums";
import { rethrowWithMessage } from "@/api/utils/error";

const ArcadeRoutes = new Hono()

	.get("list", async (c) => {
		try {
			const results = await db.select<DB.Machine>(
				`SELECT m.*, a.*, ao.*
						FROM machine m
						LEFT JOIN arcade a ON m.arcade = a.id
						LEFT JOIN arcade_owner ao ON a.id = ao.arcade
				`
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get static music", error);
		}
	})
	.get("current", async (c) => {
		try {
			const { userId } = c.payload;

			const results = await db.select<DB.Machine>(
				`SELECT m.*, a.*, ao.*
    FROM machine m
    LEFT JOIN arcade a ON m.arcade = a.id
    LEFT JOIN arcade_owner ao ON a.id = ao.arcade
  WHERE user = ?
  `,
				[userId]
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get static music", error);
		}
	})

	.get("users", async (c) => {
		try {
			const results = await db.select<DB.AimeUser>(
				`SELECT au.*, ac.access_code
						FROM aime_user au
						LEFT JOIN aime_card ac ON au.id = ac.user`
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get static music", error);
		}
	})
	.post(
		"update/location",
		validateJson(
			z.object({
				arcade: z.number(),
				country: z.string(),
				state: z.string(),
				regionId: z.number(),
			})
		),
		async (c) => {
			try {
				const { permissions } = c.payload;
				const { arcade, country, state, regionId } = await c.req.json();

				if (permissions !== UserRole.Admin) {
					throw new HTTPException(403, { message: "Admin permissions required" });
				}

				// Update location fields in the arcade table
				const update = await db.query(
					`UPDATE arcade 
        		SET country = ?, state = ?, region_id = ?
        		WHERE id = ?`,
					[country, state, regionId, arcade]
				);

				if (update.affectedRows === 0) {
					throw new HTTPException(404, { message: "Arcade not found" });
				}

				return c.json({
					success: true,
					message: "Arcade location updated successfully",
				});
			} catch (error) {
				throw rethrowWithMessage("Failed to update arcade location", error);
			}
		}
	)
	.post(
		"update",
		validateJson(
			z.object({
				arcade: z.number(),
				user: z.number(),
			})
		),
		async (c) => {
			try {
				const { permissions } = c.payload;
				const { arcade, user } = await c.req.json();

				if (permissions !== UserRole.Admin) {
					throw new HTTPException(403, { message: "Admin permissions required" });
				}

				// Update the user column n arcade_owner table
				const update = await db.query(
					`UPDATE arcade_owner 
										SET user = ?
										WHERE arcade = ?`,
					[user, arcade]
				);

				if (update.affectedRows === 0) {
					throw new HTTPException(404, { message: "Arcade owner record not found" });
				}

				return c.json({
					success: true,
					message: "Arcade owner updated successfully",
				});
			} catch (error) {
				throw rethrowWithMessage("Failed to update arcade owner", error);
			}
		}
	);

export { ArcadeRoutes };
