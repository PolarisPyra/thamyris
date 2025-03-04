import { Hono } from "hono";
import { setCookie } from "hono/cookie";

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
	});

export { UserRoutes };
