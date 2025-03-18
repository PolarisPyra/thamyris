import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

const AdminRoutes = new Hono()
	.get("/check", async (c) => {
		try {
			const { userId } = c.payload;
			const permissions = c.payload.permissions;

			if (!userId || permissions !== 2) {
				return c.json({ error: "Unauthorized - Insufficient permissions" }, 403);
			}

			return c.json({ isAdmin: true });
		} catch (error) {
			console.error("Error checking admin status:", error);
			return c.json({ error: "Failed to check admin status" }, 500);
		}
	})
	.post("/keychip/generate", async (c) => {
		try {
			const { userId } = c.payload;
			const permissions = c.payload.permissions;

			const body = await c.req.json();
			const { arcade_nickname, name, game, namcopcbid, aimecard } = body;

			if (!userId || permissions !== 2) {
				return c.json({ error: "Unauthorized - Insufficient permissions" }, 403);
			}

			const existingArcade = await db.query(
				`SELECT id 
				FROM arcade 
				WHERE name = ? 
				AND nickname = ?`,
				[name, arcade_nickname]
			);

			if (existingArcade[0]) {
				return c.json({ error: "Arcade already exists" }, 400);
			}

			// Generate serial ID based on game type
			const serialId = game === "SDEW" ? namcopcbid : aimecard;
			if (!serialId) {
				return c.json({ error: "Serial ID is required" }, 400);
			}

			const existingMachine = await db.query(
				`SELECT id 
				FROM machine 
				WHERE serial = ?`,
				[serialId]
			);

			if (existingMachine[0]) {
				return c.json({ error: "Serial ID already in use" }, 400);
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
