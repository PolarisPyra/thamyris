import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api";
import { env } from "@/env";

const AdminRoutes = new Hono()
  .get("/check", async (c) => {
    try {
      const token = getCookie(c, "auth_token");
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const payload = await verify(token, env.JWT_SECRET);
      const permissions = payload.permissions;

      // Check if user has admin privileges (permission level 2) from JWT
      if (!permissions || permissions !== 2) {
        return c.json({ error: "Unauthorized - Insufficient permissions" }, 403);
      }

      return c.json({ isAdmin: true });
    } catch (error) {
      console.error("Error checking admin status:", error);
      return c.json({ error: "Failed to check admin status" }, 500);
    }
  })
  .post("/keychip/generate", async (c) => {
    try {
      const token = getCookie(c, "auth_token");
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const payload = await verify(token, env.JWT_SECRET);
      const userId = payload.userId;
      const permissions = payload.permissions;

      const body = await c.req.json();
      const { arcade_nickname, name, game, namcopcbid, aimecard } = body;

      // Check if user has admin privileges (permission level 2) from JWT
      if (!permissions || permissions !== 2) {
        return c.json({ error: "Unauthorized - Insufficient permissions" }, 403);
      }

      const existingArcade = await db.query(
        `SELECT id 
				FROM arcade 
				WHERE name = ? 
				AND nickname = ?`,
        [name, arcade_nickname]
      );

      if (existingArcade[0]) {
        return c.json({ error: "Arcade already exists" }, 400);
      }

      // Generate serial ID based on game type
      const serialId = game === "SDEW" ? namcopcbid : aimecard;
      if (!serialId) {
        return c.json({ error: "Serial ID is required" }, 400);
      }

      // Check for existing machine
      const existingMachine = await db.query(
        `SELECT id 
				FROM machine 
				WHERE serial = ?`,
        [serialId]
      );

      if (existingMachine[0]) {
        return c.json({ error: "Serial ID already in use" }, 400);
      }

      // Create new arcade
      const result = await db.query(
        `INSERT INTO arcade (name, nickname) 
				VALUES (?, ?)`,
        [name, arcade_nickname]
      );

      const arcadeId = result.insertId;

      // Create arcade owner relationship
      await db.query(
        `INSERT INTO arcade_owner (user, arcade, permissions) 
				VALUES (?, ?, ?)`,
        [userId, arcadeId, 1]
      );

      // Create machine
      await db.query(
        `INSERT INTO machine (arcade, serial, game) 
				VALUES (?, ?, ?)`,
        [arcadeId, serialId, game === "SDEW" ? game : null]
      );

      return c.json({ success: true, arcadeId });
    } catch (error) {
      console.error("Error generating keychip:", error);
      return c.json({ error: "Failed to generate keychip" }, 500);
    }
  });

export { AdminRoutes };
