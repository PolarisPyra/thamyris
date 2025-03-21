import { Hono } from "hono";

import { db } from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const MaimaiRoutes = new Hono().get("mai2_static_music", async (c) => {
	try {
		const { versions } = c.payload;
		const version = versions.chunithm_version;

		const results = await db.select<DB.ChuniStaticMusic>(
			`SELECT id, songId, chartId, title, level, artist, genre, jacketPath  
			 FROM chuni_static_music
			 WHERE version = ?`,
			[version]
		);
		return c.json(results);
	} catch (error) {
		throw rethrowWithMessage("Failed to get static music", error);
	}
});

export { MaimaiRoutes };
