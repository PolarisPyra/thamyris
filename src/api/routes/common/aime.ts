import { db } from "@/api";
import { Hono } from "hono";

const aimeCardRoute = new Hono()
	.get("/aime_card", async (c) => {
		try {
			const rows = await db.query("SELECT * FROM aime_card");
			return c.json({ users: rows });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch users" }, 500);
		}
	})
	.get("/aime_user", async (c) => {
		try {
			const rows = await db.query("SELECT * FROM aime_user");
			return c.json({ users: rows });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch users" }, 500);
		}
	});

export { aimeCardRoute };
