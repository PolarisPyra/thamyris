import argon2 from "argon2";
import { Context, Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod";

import { env } from "@/env";

import { db } from "../db";
import { validateJson } from "../middleware/validator";
import { DB } from "../types/db";
import { JWTPayload } from "../types/jwt";

/**
 * Unprotected routes which should not require authentication.
 */
const signAndSetCookie = async (c: Context, user: DB.AimeUser, card: DB.AimeCard) => {
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
};

const unprotectedRoutes = new Hono()
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
			try {
				const { username, password } = await c.req.json();

				// Find user by username
				const [user] = await db.select<DB.AimeUser>("SELECT * FROM aime_user WHERE username = ?", [username]);

				// Check if user exists
				if (!user) {
					return c.json({ error: "Invalid username or password" }, 401);
				}

				// Verify password
				const passwordMatch = await argon2.verify(user.password, password);
				if (!passwordMatch) {
					return c.json({ error: "Invalid username or password" }, 401);
				}

				const [aimeCard] = await db.select<DB.AimeCard>("SELECT access_code FROM aime_card WHERE user = ?", [user.id]);

				// Check if chunithm_version exists
				const [existingChunithm] = await db.query(
					`SELECT * FROM daphnis_user_option 
         WHERE user = ? AND \`key\` = 'chunithm_version'`,
					[user.id]
				);

				// Check if ongeki_version exists
				const [existingOngeki] = await db.query(
					`SELECT * FROM daphnis_user_option 
         WHERE user = ? AND \`key\` = 'ongeki_version'`,
					[user.id]
				);

				// Insert chunithm_version if it doesn't exist
				if (!existingChunithm) {
					await db.query(
						`INSERT INTO daphnis_user_option (user, \`key\`, value)
           VALUES (?, 'chunithm_version', (SELECT MAX(version) FROM chuni_profile_data WHERE user = ?))`,
						[user.id, user.id]
					);
				}

				// Insert ongeki_version if it doesn't exist
				if (!existingOngeki) {
					await db.query(
						`INSERT INTO daphnis_user_option (user, \`key\`, value)
           VALUES (?, 'ongeki_version', (SELECT MAX(version) FROM ongeki_profile_data WHERE user = ?))`,
						[user.id, user.id]
					);
				}

				await signAndSetCookie(c, user, aimeCard);

				// Update last login date
				await db.update(
					`UPDATE aime_user 
         SET last_login_date = NOW() 
         WHERE id = ?`,
					[user.id]
				);

				// Successful login
				return c.json({
					message: "Login successful",
					userId: user.id,
				});
			} catch (error) {
				console.error("Login error:", error);
				return c.json({ error: "Failed to login" }, 500);
			}
		}
	)
	.post("/signup", async (c) => {
		// NOTE:
		//   Lots of separate queries here, could combine them with joins
		try {
			const body = await c.req.json();
			const { username, password, accessCode } = body;

			// Validate input
			if (!username || !password || !accessCode) {
				return c.json({ error: "Username, password, and access code are required" }, 400);
			}

			// Verify access code and get user ID
			const [aimeCard] = await db.select<DB.AimeCard>("SELECT user FROM aime_card WHERE access_code = ?", [accessCode]);

			if (!aimeCard) {
				return c.json({ error: "Invalid access code" }, 404);
			}

			const userId = aimeCard.user;

			// Check if user already has an account (username or password is set)
			const [existingUser] = await db.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

			// check contents of json payload against existing users
			if (existingUser && (existingUser.username || existingUser.password)) {
				return c.json({ error: "Account already exists for this user" }, 409);
			}

			// Check if username is already taken
			const [usernameCheck] = await db.select<DB.AimeUser>("SELECT * FROM aime_user WHERE username = ?", [username]);
			if (usernameCheck) {
				return c.json({ error: "Username already exists" }, 409);
			}

			// Hash password
			const hashedPassword = await argon2.hash(password);

			// Update existing user with the verified user ID
			const result = await db.update("UPDATE aime_user SET username = ?, password = ? WHERE id = ?", [
				username,
				hashedPassword,
				userId,
			]);

			// Check if the update was successful
			if (result.affectedRows === 0) {
				return c.json({ error: "User not found" }, 404);
			}

			const [updatedUser] = await db.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);

			// NOTE:
			//   These inserts could be pushed out to some generic
			//   handler implementation per game. Could get messy
			//   with more games.

			// Check if chunithm_version exists
			const [existingChunithm] = await db.query(
				`SELECT * FROM daphnis_user_option 
   WHERE user = ? AND \`key\` = 'chunithm_version'`,
				[userId]
			);

			// Check if ongeki_version exists
			const [existingOngeki] = await db.query(
				`SELECT * FROM daphnis_user_option 
   WHERE user = ? AND \`key\` = 'ongeki_version'`,
				[userId]
			);

			// Insert chunithm_version if it doesn't exist
			if (!existingChunithm) {
				await db.query(
					`INSERT INTO daphnis_user_option (user, \`key\`, value)
     VALUES (?, 'chunithm_version', (SELECT MAX(version) FROM chuni_profile_data WHERE user = ?))`,
					[userId, userId]
				);
			}

			// Insert ongeki_version if it doesn't exist
			if (!existingOngeki) {
				await db.query(
					`INSERT INTO daphnis_user_option (user, \`key\`, value)
     VALUES (?, 'ongeki_version', (SELECT MAX(version) FROM ongeki_profile_data WHERE user = ?))`,
					[userId, userId]
				);
			}

			await signAndSetCookie(c, updatedUser, aimeCard);

			// Update last login date
			await db.update(
				`UPDATE aime_user 
     SET last_login_date = NOW() 
     WHERE id = ?`,
				[userId]
			);

			return c.json({
				message: "Signup successful",
				userId: userId,
				// NOTE: Hmmm, if we're going to return errors,
				//       we might want to override types to include it
				//	     in every response. Getting a type issue here in client
				//	   because it's not included in the happy path.
				error: null,
			});
		} catch (error) {
			console.error("Signup error:", error);
			return c.json({ error: "Failed to signup" }, 500);
		}
	});

export { unprotectedRoutes };
