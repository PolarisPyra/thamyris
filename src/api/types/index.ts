import { DB } from "./db";
import { JWTPayload } from "./jwt";

/**
 * Since Hono provides the client with types for responses,
 * these types can probably be defined just in the API.
 */
export type { DB, JWTPayload };
