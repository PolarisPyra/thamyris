import { JWTPayload as HonoJWTPayload } from "hono/utils/jwt/types";

type TrimmedJWT = Pick<HonoJWTPayload, "exp" | "nbf" | "iat">;
export interface JWTPayload extends TrimmedJWT {
	// We're explictly setting exp so should be defined, unlike Hono's type
	exp: number;

	userId: number;
	username: string;
	permissions: number;
	aimeCardId: string;
}
