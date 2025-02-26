import { MiddlewareHandler } from "hono";

import { JWTPayload } from "../types";

declare module "hono" {
	interface Context {
		payload: JWTPayload;
	}
}

/**
 *  Just reassigns the JWT payload directly to the context,
 *  instead of having to access it through a string key everywhere.
 */
export const jwtPayloadMiddleware = (): MiddlewareHandler => {
	return async (c, next) => {
		c.payload = c.get("jwtPayload");
		await next();
	};
};
