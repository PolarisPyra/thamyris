import { env } from "@/env";
import { Hono } from "hono";
import { db } from "../..";
import argon2 from "argon2";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

const loginRoutes = new Hono()
	.post("/login", async (c) => {
		try {
			const { username, password } = await c.req.json();

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
				permissions: user.permissions || 0,
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
				domain: env.NODE_ENV === "production" ? env.DOMAIN : "localhost",
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
				permissions: 1, // Default permissions for new users
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
				domain: env.NODE_ENV === "production" ? env.DOMAIN : "localhost",
			});

			return c.json({
				message: "Signup successful",
				userId: userId,
			});
		} catch (error) {
			console.error("Signup error:", error);
			return c.json({ error: "Failed to signup" }, 500);
		}
	});

export default loginRoutes;
