import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const AimeCardRoute = new Hono()
	.get("/aime_card", async (c) => {
		try {
			const rows = await db.select<DB.AimeCard>("SELECT * FROM aime_card");
			return c.json({ users: rows });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json(rethrowWithMessage("Failed to fetch users", error));
		}
	})
	.get("/aime_user", async (c) => {
		try {
			const rows = await db.select<DB.AimeUser>("SELECT * FROM aime_user");
			return c.json({ users: rows });
		} catch (error) {
			throw rethrowWithMessage("Failed to fetch users", error);
		}
	})
	.post("/update", async (c) => {
		try {
			const userId = c.payload.userId;
			const { accessCode } = await c.req.json();

			const result = await db.query(
				`UPDATE aime_card 
            SET access_code = ? 
            WHERE user = ?`,
				[accessCode, userId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "User not found" }, 404);
			}

			return c.json({ success: true });
		} catch (error) {
			throw rethrowWithMessage("Failed to update aime card", error);
		}
	});
export { AimeCardRoute };
