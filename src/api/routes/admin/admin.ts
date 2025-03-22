import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db } from "@/api/db";
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
