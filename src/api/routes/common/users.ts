import { db } from "@/api";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { env } from "@/env";

const userRoutes = new Hono()
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

		return c.json({ message: "Logout successful" });
	})
	.post("/verify", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				console.log("No auth token found in cookies");
				return c.json({ authenticated: false }, 401);
			}

			// Verify the token
			const payload = await verify(token, env.JWT_SECRET);

			return c.json({ authenticated: true, user: payload });
		} catch (error) {
			console.error("Token verification failed:", error);
			return c.json(
				{
					authenticated: false,
					error: error instanceof Error ? error.message : "Token verification failed",
				},
				401
			);
		}
	})
	.get("/username", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const [user] = await db.query(
				`SELECT username 
     FROM aime_user 
     WHERE id = ?`,
				[userId]
			);

			return c.json({ username: user?.username || "Unknown User" });
		} catch (error) {
			console.error("Error getting versions:", error);
			return c.json({ error: "Failed to get versions" }, 500);
		}
	});

export { userRoutes };
