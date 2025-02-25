import React from "react";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { secureHeaders } from "hono/secure-headers";
import { csrf } from "hono/csrf";
import { renderToString } from "react-dom/server";
import { routes } from "./api";
import { authMiddleware } from "./api/middleware/auth";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { env } from "./env";
const server = new Hono({});

// Replace the existing CORS and CSRF configuration with:
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const port = process.env.NODE_ENV === "production" ? "" : `:${env.CLIENT_PORT}`;
const origin = `${protocol}://${env.DOMAIN}${port}`;

server.use(
	"*",
	cors({
		origin: [origin],
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
	})
);

server.use(
	"*",
	csrf({
		origin: (requestOrigin) => {
			const allowedOrigins = [origin];
			return allowedOrigins.includes(requestOrigin);
		},
	})
);

server.use(secureHeaders());

// API routes

// Add your routes before the catch-all middleware
server.route("/api", routes);

// Then add the auth middleware only for protected routes
server.use("/api/*", authMiddleware);
// Public assets
server.use("/public/*", serveStatic({ root: "./public" }));
server.use("/assets/*", serveStatic({ root: "./dist/assets" }));

// Serve HTML for all other routes
server.get("/*", (c) => {
	const html = renderToString(
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
	);
	return c.html(html);
});

// Only start the server if we're in the server process
serve({
	fetch: server.fetch,
	port: env.SERVER_PORT,
});

export default server;
