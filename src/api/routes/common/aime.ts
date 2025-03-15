import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/http-wrappers";

const AimeCardRoute = new Hono()
	.get("/aime_card", async (c) => {
		try {
			const rows = await db.select<DB.AimeCard>("SELECT * FROM aime_card");
			return c.json({ users: rows });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json(rethrowWithMessage("Failed to fetch users", error));
		}
	})
	.get("/aime_user", async (c) => {
		try {
			const rows = await db.select<DB.AimeUser>("SELECT * FROM aime_user");
			return c.json({ users: rows });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json(rethrowWithMessage("Failed to fetch users", error));
		}
	});

export { AimeCardRoute };
