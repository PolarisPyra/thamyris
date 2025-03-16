import argon2 from "argon2";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { env } from "@/env";

import { db } from "../db";
import { validateJson } from "../middleware/validator";
import { DB } from "../types/db";
import { clearCookie, signAndSetCookie } from "../utils/cookie";
import { rethrowWithMessage } from "../utils/error";
import { getUserGameVersions } from "../utils/versions";

/**
 * Unprotected routes which should not require authentication.
 */

const UnprotectedRoutes = new Hono()
	// Apply rate limiting to all unprotected routes
	// NOTE: Might want to see about applying this to all routes,
	//       a user doesn't have to be logged in to hit protected routes
	.use(
		"/",
		rateLimiter({
			windowMs: 1 * 60 * 1000,
			limit: 5,
			standardHeaders: "draft-6",
			keyGenerator: () => env.RATELIMIT_KEY,
		})
	)
	.post(
		"/login",
		validateJson(
			z.object({
				username: z.string(),
				password: z.string(),
			})
		),
		async (c) => {
			const { username, password } = await c.req.json();

			const user = await db.inTransaction(async (conn) => {
				try {
					// Find user by username
					const [user] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE username = ?", [username]);
					if (!user) {
						throw new HTTPException(401, { message: "Invalid username or password" });
					}

					// Verify password
					const passwordMatch = await argon2.verify(user.password, password);
					if (!passwordMatch) {
						throw new HTTPException(401, { message: "Invalid username or password" });
					}
					const [aimeCard] = await conn.select<DB.AimeCard>("SELECT access_code FROM aime_card WHERE user = ?", [user.id]);

					// Update last login date
					await conn.update(
						`
							UPDATE aime_user 
							SET last_login_date = NOW() 
							WHERE id = ?
						`,
						[user.id]
					);

					// Grab latest versions
					const versions = await getUserGameVersions(user.id, conn);

					// Successful login
					return await signAndSetCookie(c, user, aimeCard, versions);
				} catch (error) {
					throw rethrowWithMessage("Failed to login", error);
				}
			});

			return c.json(user);
		}
	)
	.post("/logout", async (c) => {
		// Clear the auth_token cookie
		clearCookie(c);
		return c.json({ message: "Logged out" });
	})
	.post(
		"/signup",
		validateJson(
			z.object({
				username: z.string(),
				password: z.string(),
				accessCode: z.string(),
			})
		),
		async (c) => {
			const body = await c.req.json();
			const { username, password, accessCode } = body;

			// NOTE:
			//   Lots of separate queries here, could combine them with joins
			const user = await db.inTransaction(async (conn) => {
				try {
					// Verify access code and get user ID
					const [aimeCard] = await conn.select<DB.AimeCard>("SELECT user FROM aime_card WHERE access_code = ?", [
						accessCode,
					]);
					if (!aimeCard) {
						throw new HTTPException(404, { message: "Aime Card not found" });
					}

					// Check if user already has an account (username or password is set)
					const userId = aimeCard.user;
					const [user] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

					// check contents of json payload against existing users
					if (user?.username || user?.password) {
						throw new HTTPException(409, { message: "Account already exists for this user" });
					}

					// Check if username is already taken
					const [usernameCheck] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE username = ?", [username]);
					if (usernameCheck) {
						throw new HTTPException(409, { message: "Username already exists" });
					}

					// Hash password
					const hashedPassword = await argon2.hash(password);

					// Update existing user with the verified user ID
					const result = await conn.update("UPDATE aime_user SET username = ?, password = ? WHERE id = ?", [
						username,
						hashedPassword,
						userId,
					]);
					// Check if the update was successful
					if (result.affectedRows === 0) {
						throw new HTTPException(500, { message: "Failed to update aime_user" });
					}

					// NOTE: aimedb makes default users have a placeholder NULL name so we need to get the new username after we insert it
					const [updatedUser] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

					// Update last login date
					await conn.update(
						`
							UPDATE aime_user 
		 					SET last_login_date = NOW() 
		 					WHERE id = ?
						`,
						[userId]
					);

					// Grab user game versions
					const versions = await getUserGameVersions(user.id, conn);
					return await signAndSetCookie(c, updatedUser, aimeCard, versions);
				} catch (error) {
					throw rethrowWithMessage("Failed to create account", error);
				}
			});

			return c.json(user);
		}
	);

export { UnprotectedRoutes };
