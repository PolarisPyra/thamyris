import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import db from "@/api/db";
import { env } from "@/env";

const UserRoutes = new Hono()
	.post("/logout", async (c) => {
		// Clear the auth_token cookie
		setCookie(c, "auth_token", "", {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 0,
			path: "/",
			domain: env.NODE_ENV === "production" ? env.DOMAIN : "localhost",
		});

		// NOTE:
		//   Unless we're displaying these messages to the user,
		//   or including specific information in the response,
		//   a status code is probably sufficient.
		return c.json({ message: "Logout successful" });
	})
	.post("/verify", async (c) => {
		// The JWT middleware will have already verified the token
		// and added the payload to the context
		return c.json({ user: c.payload });
	})
	.get("/username", async (c) => {
		const { username } = c.payload;
		return c.json({ username });
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
			console.error("Error updating aime card:", error);
			return c.json({ error: "Failed to update aime card" }, 500);
		}
	});

export { UserRoutes };
