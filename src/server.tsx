/** @jsxImportSource hono/jsx */
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { jsxRenderer } from "hono/jsx-renderer";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { jwtPayloadMiddleware } from "./api/middleware/jwtPayload";
import { Routes, UnprotectedRoutes } from "./api/routes";
import { env } from "./env";

const protocol = env.NODE_ENV === "production" ? "https" : "http";
const port = env.NODE_ENV === "production" ? "" : `:${env.CLIENT_PORT}`;
const origin = `${protocol}://${env.DOMAIN}${port}`;

// Use our JWT payload type as a variable for the JWT middleware

const server = new Hono()
	// CORS
	.use(
		"*",
		cors({
			origin: [origin],
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
		})
	)

	// CSRF
	.use(
		"*",
		csrf({
			origin: (requestOrigin) => {
				const allowedOrigins = [origin];
				return allowedOrigins.includes(requestOrigin);
			},
		})
	)

	// Secure headers
	.use(secureHeaders())

	// Logger
	.use(logger())

	// Error handling
	// NOTE:
	// 	 By handling here, don't necessarily need to wrap each route in a try/catch block,
	//   can just throw specific HTTPExceptions and they will be caught here.
	// 	 However, additional onErrors can wrap specific routes to inject additional error handling,
	//   such as prefixing error messages with junk like: "Login Error: <specific route error>"
	//   There might be a Hono approach for this case specifically, otherwise a custom middleware
	//   could easily be created for simple usage.
	//		eg. onErr(prefix:string, handler: (err, c) => c.json({ error: `${prefix}: ${err.message}` }, 500))
	.onError((err, c) => {
		if (err instanceof HTTPException) {
			return c.json({ error: err.message }, err.status);
		}
		return c.json({ error: "Internal server error" }, 500);
	})

	// Non-authenticated routes
	.route("/api", UnprotectedRoutes)

	// Authenticated routes
	.use(jwt({ secret: env.JWT_SECRET, cookie: "auth_token" }))
	// NOTE:
	// They think people'll access the payload with a string everywhere?
	// Just add it as an explicit object to the context, this is typescript for god's sake
	.use(jwtPayloadMiddleware())
	.route("/api", Routes)

	// Public assets
	.use("/public/*", serveStatic({ root: "./public" }))
	.use("/assets/*", serveStatic({ root: "./assets" }))

	// Serve HTML for all other routes
	.get(
		"/*",
		jsxRenderer(() => (
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>Thamyris</title>
				</head>
				<body>
					<div id="root"></div>
					<script type="module" src="/src/client.tsx"></script>
				</body>
			</html>
		))
	);

// TODO: Compress response
// .use(compress());

// Only start the server if we're in the server process
serve({
	fetch: server.fetch,
	port: env.SERVER_PORT,
});

export default server;
