import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import type { Context, Next } from "hono";
import { env } from "@/env";

const authMiddleware = async (c: Context, next: Next) => {
	const token = getCookie(c, "auth_token");
	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	try {
		const payload = await verify(token, env.JWT_SECRET);
		c.set("user", payload);
		await next();
	} catch (error) {
		console.error("Token verification error:", error);
		return c.json({ error: "Invalid token" }, 401);
	}
};

export { authMiddleware };
