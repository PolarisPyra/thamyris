import { JWTPayload as HonoJWTPayload } from "hono/utils/jwt/types";

type TrimmedJWT = Pick<HonoJWTPayload, "exp" | "nbf" | "iat">;

/**
 * JWT Payload interface extending Hono's base JWT type
 * @property {number} exp - Expiration timestamp
 * @property {number} userId - User ID
 * @property {string} username - Username
 * @property {number} permissions - User permissions
 * @property {string} aimeCardId - Aime card ID
 */

export interface JWTPayload extends TrimmedJWT {
	// We're explictly setting exp so should be defined, unlike Hono's type
	exp: number;

	userId: number;
	username: string;
	permissions: number;
	aimeCardId: string;
}
