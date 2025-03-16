import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB, DaphnisUserOptionKey } from "@/api/types/db";
import { signAndSetCookie } from "@/api/utils/cookie";
import { rethrowWithMessage } from "@/api/utils/error";
import { getUserGameVersions } from "@/api/utils/versions";

const ChunithmSettingsRoutes = new Hono()
	.post(
		"/settings/update",
		validateJson(
			z.object({
				version: z.number().min(1),
			})
		),
		async (c) => {
			try {
				const result = await db.inTransaction(async (conn) => {
					const { userId, aimeCardId } = c.payload;
					const { version } = await c.req.json();

					const result = await db.update(
						`
							UPDATE daphnis_user_option 
							SET value = ?
							WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.ChunithmVersion}'
						`,
						[version, userId]
					);

					if (result.affectedRows === 0) {
						throw new HTTPException(404);
					}

					// Gotta update the cookie now that the version has changed
					const [user] = await conn.select<DB.AimeUser>("SELECT * FROM aime_user WHERE id = ?", [userId]);
					const [card] = await conn.select<DB.AimeCard>("SELECT * FROM aime_card WHERE id = ?", [aimeCardId]);
					if (!user || !card) {
						throw new HTTPException(404);
					}
					const versions = await getUserGameVersions(userId, conn);
					return await signAndSetCookie(c, user, card, versions);
				});
				return c.json(result);
			} catch (error) {
				throw rethrowWithMessage("Failed to update settings", error);
			}
		}
	)
	.get("/settings/versions", async (c) => {
		try {
			const userId = c.payload.userId;
			const versions = await db.select<{ version: number }>(
				`
					SELECT DISTINCT version 
					FROM chuni_profile_data 
					WHERE user = ? 
					ORDER BY version DESC
				`,
				[userId]
			);

			return c.json(versions.map((v) => v.version));
		} catch (error) {
			throw rethrowWithMessage("Failed to get versions", error);
		}
	})

	/**
	 * Unlock endpoints
	 */
	.post("/settings/songs/unlock", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`
					UPDATE daphnis_user_option 
             		SET value = '1' 
             		WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.UnlockAllSongs}'
				`,
				[userId]
			);

			return new Response();
		} catch (error) {
			throw rethrowWithMessage("Failed to unlock all songs", error);
		}
	})
	.post("/settings/songs/lock", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`
					UPDATE daphnis_user_option 
					SET value = '0' 
					WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.UnlockAllSongs}'
				`,
				[userId]
			);

			return new Response();
		} catch (error) {
			throw rethrowWithMessage("Failed to lock songs", error);
		}
	})
	.post("/settings/tickets/unlimited", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`
					UPDATE daphnis_user_option 
					SET value = '1' 
					WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.MaxTickets}'
			 	`,
				[userId]
			);

			return new Response();
		} catch (error) {
			throw rethrowWithMessage("Failed to enable unlimited tickets", error);
		}
	})
	.post("/settings/tickets/limited", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`
					UPDATE daphnis_user_option 
					SET value = '0' 
					WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.MaxTickets}'
			 	`,
				[userId]
			);

			return new Response();
		} catch (error) {
			throw rethrowWithMessage("Failed to disable unlimited tickets", error);
		}
	});

export { ChunithmSettingsRoutes };
