import { db } from "@/api";
import argon2 from "argon2";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { rateLimiter } from "hono-rate-limiter";
import { env } from "@/env";

const domain = env.DOMAIN;
const key = env.RATELIMIT_KEY;

const limiter = rateLimiter({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 5,
	standardHeaders: "draft-6",
	keyGenerator: () => key,
});

const userRoutes = new Hono()
	.post("/login", limiter, async (c) => {
		try {
			const body = await c.req.json();
			const username = body.username;
			const password = body.password;

			// Validate input
			if (!username || !password) {
				return c.json({ error: "Username and password are required" }, 400);
			}

			// Find user by username
			const [user] = await db.query("SELECT * FROM aime_user WHERE username = ?", [username]);

			// Check if user exists
			if (!user) {
				return c.json({ error: "Invalid username or password" }, 401);
			}

			// Verify password
			const passwordMatch = await argon2.verify(user.password, password);
			if (!passwordMatch) {
				return c.json({ error: "Invalid username or password" }, 401);
			}
			const [aimeCard] = await db.query("SELECT access_code FROM aime_card WHERE user = ?", [user.id]);

			// Create JWT token
			const payload = {
				userId: user.id,
				username: user.username,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
				aimeCardId: aimeCard?.access_code,
			};
			const token = await sign(payload, env.JWT_SECRET);

			// Set JWT token as a cookie
			setCookie(c, "auth_token", token, {
				httpOnly: true,
				secure: env.NODE_ENV === "production",
				sameSite: "Strict",
				maxAge: 60 * 60 * 24, // 1 day
				path: "/",
				domain: env.NODE_ENV === "production" ? domain : "localhost",
			});

			// Update last login date
			await db.query(
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
	})
	.post("/signup", async (c) => {
		try {
			const body = await c.req.json();
			const { username, password, accessCode } = body;

			// Validate input
			if (!username || !password || !accessCode) {
				return c.json({ error: "Username, password, and access code are required" }, 400);
			}

			// Verify access code and get user ID
			const [aimeCard] = await db.query("SELECT user FROM aime_card WHERE access_code = ?", [
				accessCode,
			]);

			if (!aimeCard) {
				return c.json({ error: "Invalid access code" }, 404);
			}

			const userId = aimeCard.user;

			// Check if user already has an account (username or password is set)
			const [existingUser] = await db.query("SELECT * FROM aime_user WHERE id = ?", [userId]);

			// check contents of json payload against existing users
			if (existingUser && (existingUser.username || existingUser.password)) {
				return c.json({ error: "Account already exists for this user" }, 409);
			}

			// Check if username is already taken
			const [usernameCheck] = await db.query("SELECT * FROM aime_user WHERE username = ?", [username]);
			if (usernameCheck) {
				return c.json({ error: "Username already exists" }, 409);
			}

			// Hash password
			const hashedPassword = await argon2.hash(password);

			// Update existing user with the verified user ID
			const result = await db.query("UPDATE aime_user SET username = ?, password = ? WHERE id = ?", [
				username,
				hashedPassword,
				userId,
			]);

			// Check if the update was successful
			if (result.affectedRows === 0) {
				return c.json({ error: "User not found" }, 404);
			}

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

			// Update last login date
			await db.query(
				`UPDATE aime_user 
     SET last_login_date = NOW() 
     WHERE id = ?`,
				[userId]
			);

			// Create JWT token
			const payload = {
				userId: userId,
				username: username,
				aimeCardId: accessCode,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
			};

			const token = await sign(payload, env.JWT_SECRET);

			// Set JWT token as a cookie
			setCookie(c, "auth_token", token, {
				httpOnly: true,
				secure: env.NODE_ENV === "production",
				sameSite: "Strict",
				maxAge: 60 * 60 * 24, // 1 day
				path: "/",
				domain: env.NODE_ENV === "production" ? domain : "localhost",
			});

			return c.json({
				message: "Signup successful",
				userId: userId,
			});
		} catch (error) {
			console.error("Signup error:", error);
			return c.json({ error: "Failed to signup" }, 500);
		}
	})
	.post("/logout", async (c) => {
		// Clear the auth_token cookie
		setCookie(c, "auth_token", "", {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 0,
			path: "/",
			domain: env.NODE_ENV === "production" ? domain : "localhost",
		});

		return c.json({ message: "Logout successful" });
	})

	.post("/verify", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				console.log("No auth token found in cookies");
				return c.json({ authenticated: false }, 401);
			}

			// Verify the token
			const payload = await verify(token, env.JWT_SECRET);

			return c.json({ authenticated: true, user: payload });
		} catch (error) {
			console.error("Token verification failed:", error);
			return c.json(
				{
					authenticated: false,
					error: error instanceof Error ? error.message : "Token verification failed",
				},
				401
			);
		}
	})
	.get("/username", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const [user] = await db.query(
				`SELECT username 
     FROM aime_user 
     WHERE id = ?`,
				[userId]
			);

			return c.json({ username: user?.username || "Unknown User" });
		} catch (error) {
			console.error("Error getting versions:", error);
			return c.json({ error: "Failed to get versions" }, 500);
		}
	});

export { userRoutes };
