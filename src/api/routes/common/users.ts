import { Hono } from "hono";

import db from "@/api/db";
import { notFoundWithMessage, rethrowWithMessage, successWithMessage } from "@/api/utils/error";

const UserRoutes = new Hono()
	.post("/verify", async (c) => {
		// The JWT middleware will have already verified the token
		// and added the payload to the context
		return c.json(c.payload);
	})
	.post("/update-aimecard", async (c) => {
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
				return c.json(notFoundWithMessage("Failed to update aime card", result));
			}

			return c.json(successWithMessage("Aime card updated successfully", result));
		} catch (error) {
			console.error("Error updating aime card:", error);
			return c.json(rethrowWithMessage("Failed to update aime card", error));
		}
	});

export { UserRoutes };
