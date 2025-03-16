import { MiddlewareHandler } from "hono";

import { JWTPayload } from "../types";
import { UserMeta } from "../types/jwt";

declare module "hono" {
	interface Context {
		payload: UserMeta;
	}
}

/**
 *  Just reassigns the JWT payload directly to the context,
 *  instead of having to access it through a string key everywhere.
 */
export const jwtPayloadMiddleware = (): MiddlewareHandler => {
	return async (c, next) => {
		c.payload = JSON.parse((c.get("jwtPayload") as JWTPayload).user);
		await next();
	};
};
