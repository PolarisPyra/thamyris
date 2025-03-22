import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { UserRole } from "@/api/types/enums";
import { rethrowWithMessage } from "@/api/utils/error";

const AdminRoutes = new Hono()
	.get("/check", async (c) => {
		try {
			const { userId, permissions } = c.payload;

			if (!userId || permissions !== UserRole.Admin) {
				throw new HTTPException(403);
			}

			return c.json({ isAdmin: true });
		} catch (error) {
			throw rethrowWithMessage("Failed to check admin status", error);
		}
	})

	.get("arcades", async (c) => {
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

				// Update the user column in arcade_owner table
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
	)

	.post("/keychip/generate", async (c) => {
		try {
			const { userId, permissions } = c.payload;

			const body = await c.req.json();
			const { arcade_nickname, name, game, namcopcbid, aimecard } = body;

			if (!userId || permissions !== UserRole.Admin) {
				throw new HTTPException(403);
			}

			const existingArcade = await db.query(
				`SELECT id 
				FROM arcade 
				WHERE name = ? 
				AND nickname = ?`,
				[name, arcade_nickname]
			);

			if (existingArcade[0]) {
				throw new HTTPException(400);
			}

			// Generate serial ID based on game type
			const serialId = game === "SDEW" ? namcopcbid : aimecard;
			if (!serialId) {
				throw new HTTPException(400);
			}

			const existingMachine = await db.query(
				`SELECT id 
				FROM machine 
				WHERE serial = ?`,
				[serialId]
			);

			if (existingMachine[0]) {
				throw new HTTPException(400);
			}

			// Create new arcade
			const result = await db.query(
				`INSERT INTO arcade (name, nickname) 
				VALUES (?, ?)`,
				[name, arcade_nickname]
			);

			const arcadeId = result.insertId;

			await db.query(
				`INSERT INTO arcade_owner (user, arcade, permissions) 
				VALUES (?, ?, ?)`,
				[userId, arcadeId, 1]
			);

			await db.query(
				`INSERT INTO machine (arcade, serial, game) 
				VALUES (?, ?, ?)`,
				[arcadeId, serialId, game === "SDEW" ? game : null]
			);

			return c.json({ success: true, arcadeId });
		} catch (error) {
			throw rethrowWithMessage("Failed to generate keychip", error);
		}
	});

export { AdminRoutes };
