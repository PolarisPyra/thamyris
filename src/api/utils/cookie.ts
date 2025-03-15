import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

import { env } from "@/env";

import { DB, JWTPayload } from "../types";

export const signAndSetCookie = async (c: Context, user: DB.AimeUser, card: DB.AimeCard): Promise<JWTPayload> => {
	// Create JWT token
	const payload: JWTPayload = {
		userId: user.id,
		username: user.username,
		permissions: user.permissions || 0,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
		aimeCardId: card?.access_code,
	};

	// Using 'any' here because Hono is sitting on their hands:
	// https://github.com/honojs/hono/issues/2492
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const token = await sign(payload as any, env.JWT_SECRET);

	// Set JWT token as a cookie
	setCookie(c, "auth_token", token, {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "Strict",
		maxAge: 60 * 60 * 24, // 1 day
		path: "/",
		domain: env.NODE_ENV === "production" ? env.DOMAIN : "localhost",
	});

	return payload;
};

export const clearCookie = (c: Context) => {
	setCookie(c, "auth_token", "", {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "Strict",
		maxAge: 0,
		path: "/",
		domain: env.NODE_ENV === "production" ? env.DOMAIN : "localhost",
	});
};
