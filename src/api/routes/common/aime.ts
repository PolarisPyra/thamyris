import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import { db } from "@/api";

const aimeCardRoute = new Hono()
  .get("/aime_card", async (c) => {
    try {
      const token = getCookie(c, "auth_token");
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const rows = await db.query("SELECT * FROM aime_card");
      return c.json({ users: rows });
    } catch (error) {
      console.error("Error executing query:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  })
  .get("/aime_user", async (c) => {
    try {
      const token = getCookie(c, "auth_token");
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const rows = await db.query("SELECT * FROM aime_user");
      return c.json({ users: rows });
    } catch (error) {
      console.error("Error executing query:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  });

export { aimeCardRoute };
