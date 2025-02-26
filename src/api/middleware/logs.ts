import { Context, Next } from "hono";

import { env } from "@/env";

export const routeLogger = async (c: Context, next: Next) => {
	const isServer = typeof process !== "undefined" && env.NODE_ENV !== undefined;

	const start = Date.now();
	const { method, url } = c.req;

	try {
		await next();

		const elapsed = Date.now() - start;
		const status = c.res.status;

		if (isServer) {
			console.log(`[${new Date().toISOString()}] ${method} ${url} - Status: ${status} - ${elapsed}ms`);
		}
	} catch (error) {
		const elapsed = Date.now() - start;
		if (isServer) {
			console.error(`[${new Date().toISOString()}]  ${method} ${url} - Error: ${error} - ${elapsed}ms`);
		}
		throw error;
	}
};
