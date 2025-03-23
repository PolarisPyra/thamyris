import { Hono } from "hono";

import db from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

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
				return c.json({ error: "User not found" }, 404);
			}

			return c.json({ success: true });
		} catch (error) {
			throw rethrowWithMessage("Failed to update aime card", error);
		}
	})
	.get("/build-info", (c) => {
		return c.json({
			buildDate: env.BUILD_DATE_YEAR_MONTH_DAY,
			buildTime: env.BUILD_TIME_12_HOUR,
			buildHash: env.BUILD_HASH,
		});
	});

export { UserRoutes };
