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
import {
	badRequestWithMessage,
	conflictRequestWithMessage,
	rethrowWithMessage,
	unauthorizedWithMessage,
} from "../utils/http-wrappers";

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
						return c.json(unauthorizedWithMessage("Unauthorized", username));
					}

					// Verify password
					const passwordMatch = await argon2.verify(user.password, password);
					if (!passwordMatch) {
						return c.json(unauthorizedWithMessage("Unauthorized", username));
					}
					const [aimeCard] = await conn.select<DB.AimeCard>("SELECT access_code FROM aime_card WHERE user = ?", [user.id]);

					// Check if chunithm_version exists
					const [existingChunithm] = await conn.select<DB.DaphnisUserOption>(
						`SELECT * FROM daphnis_user_option 
			WHERE user = ? AND \`key\` = 'chunithm_version'`,
						[user.id]
					);

					// Check if ongeki_version exists
					const [existingOngeki] = await conn.select<DB.DaphnisUserOption>(
						`SELECT * FROM daphnis_user_option 
			WHERE user = ? AND \`key\` = 'ongeki_version'`,
						[user.id]
					);

					// Insert chunithm_version if it doesn't exist
					if (!existingChunithm) {
						await conn.query(
							`INSERT INTO daphnis_user_option (user, \`key\`, value)
			VALUES (?, 'chunithm_version', (SELECT MAX(version) FROM chuni_profile_data WHERE user = ?))`,
							[user.id, user.id]
						);
					}

					// Insert ongeki_version if it doesn't exist
					if (!existingOngeki) {
						await conn.query(
							`INSERT INTO daphnis_user_option (user, \`key\`, value)
			VALUES (?, 'ongeki_version', (SELECT MAX(version) FROM ongeki_profile_data WHERE user = ?))`,
							[user.id, user.id]
						);
					}

					// Update last login date
					await db.update(
						`UPDATE aime_user 
			SET last_login_date = NOW() 
			WHERE id = ?`,
						[user.id]
					);

					// Successful login
					return await signAndSetCookie(c, user, aimeCard);
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
					const [existingUser] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

					// check contents of json payload against existing users
					if (existingUser && (existingUser.username || existingUser.password)) {
						return c.json(conflictRequestWithMessage("Account already exists for this user", existingUser));
					}

					// Check if username is already taken
					const [usernameCheck] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE username = ?", [username]);
					if (usernameCheck) {
						return c.json(conflictRequestWithMessage("Username already exists", usernameCheck));
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
						return c.json(badRequestWithMessage("Failed to update aime_user", result));
					}

					// NOTE: aimedb makes default users have a placeholder NULL name so we need to get the new username after we insert it
					const [updatedUser] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

					// NOTE:
					//   These inserts could be pushed out to some generic
					//   handler implementation per game. Could get messy
					//   with more games.

					// Check if chunithm_version exists
					const [existingChunithm] = await conn.select<DB.DaphnisUserOption>(
						`SELECT * FROM daphnis_user_option 
	   WHERE user = ? AND \`key\` = 'chunithm_version'`,
						[userId]
					);

					// Check if ongeki_version exists
					const [existingOngeki] = await conn.select<DB.DaphnisUserOption>(
						`SELECT * FROM daphnis_user_option 
	   WHERE user = ? AND \`key\` = 'ongeki_version'`,
						[userId]
					);

					// Insert chunithm_version if it doesn't exist
					if (!existingChunithm) {
						await conn.query(
							`INSERT INTO daphnis_user_option (user, \`key\`, value)
		 VALUES (?, 'chunithm_version', (SELECT MAX(version) FROM chuni_profile_data WHERE user = ?))`,
							[userId, userId]
						);
					}

					// Insert ongeki_version if it doesn't exist
					if (!existingOngeki) {
						await conn.query(
							`INSERT INTO daphnis_user_option (user, \`key\`, value)
		 VALUES (?, 'ongeki_version', (SELECT MAX(version) FROM ongeki_profile_data WHERE user = ?))`,
							[userId, userId]
						);
					}

					// Update last login date
					await conn.update(
						`UPDATE aime_user 
		 SET last_login_date = NOW() 
		 WHERE id = ?`,
						[userId]
					);

					return await signAndSetCookie(c, updatedUser, aimeCard);
				} catch (error) {
					throw rethrowWithMessage("Failed to create account", error);
				}
			});

			return c.json(user);
		}
	);

export { UnprotectedRoutes };
