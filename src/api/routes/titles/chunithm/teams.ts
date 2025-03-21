import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

const ChunithmTeamsRoutes = new Hono()

	.get("teams", async (c) => {
		try {
			const results = await db.select<DB.ChuniProfileTeam>(`SELECT * FROM chuni_profile_team`);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get teams", error);
		}
	})

	.post(
		"updateteam",
		validateJson(
			z.object({
				teamId: z.number(),
				userId: z.number(),
				version: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const { teamId } = await c.req.json();

				const version = versions.chunithm_version;

				const result = await db.query(
					`
                UPDATE 
                chuni_profile_data 
                SET teamId = ? 
                WHERE user = ? 
                AND version = ?`,
					[teamId, userId, version]
				);
				return c.json(result);
			} catch (error) {
				throw rethrowWithMessage("Failed to remove favorite", error);
			}
		}
	)

	.post(
		"addteam",
		validateJson(
			z.object({
				teamName: z.string().min(1),
			})
		),
		async (c) => {
			try {
				const { teamName } = await c.req.json();

				const existingTeam = await db.query(`SELECT id FROM chuni_profile_team WHERE teamName = ?`, [teamName]);

				if (existingTeam.length > 0) {
					throw new HTTPException(409, { message: "Team already exists" });
				}

				const insert = await db.query(`INSERT INTO chuni_profile_team (teamName) VALUES (?)`, [teamName]);

				return c.json(insert);
			} catch (error) {
				throw rethrowWithMessage("Failed to add team", error);
			}
		}
	);

export { ChunithmTeamsRoutes };
