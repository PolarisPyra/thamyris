/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import { jsxRenderer } from "hono/jsx-renderer";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";

import { authRoutes, openRoutes } from "./api/routes";
import { env } from "./env";

const protocol = env.NODE_ENV === "production" ? "https" : "http";
const port = env.NODE_ENV === "production" ? "" : `:${env.CLIENT_PORT}`;
const origin = `${protocol}://${env.DOMAIN}${port}`;

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

	// Non-authenticated routes
	.use(
		"/api/open",
		rateLimiter({
			windowMs: 1 * 60 * 1000, // 1 minute
			limit: 5,
			standardHeaders: "draft-6",
			keyGenerator: () => env.RATELIMIT_KEY,
		})
	)
	.route("/api/open", openRoutes)

	// Authenticated routes
	.use(jwt({ secret: env.JWT_SECRET, cookie: "auth_token" }))
	.route("/api", authRoutes)

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
