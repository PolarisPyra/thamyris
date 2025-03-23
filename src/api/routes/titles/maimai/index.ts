import { Hono } from "hono";

import db from "@/api/db";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

import { MaimaiRoutes } from "./maimai";

export const AllMaimaiRoutes = new Hono()

	.route("", MaimaiRoutes)

	.get("chuni_static_music", async (c) => {
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
