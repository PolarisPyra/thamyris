import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB, DaphnisUserOptionKey } from "@/api/types/db";
import { signAndSetCookie } from "@/api/utils/cookie";
import { rethrowWithMessage } from "@/api/utils/error";
import { getUserGameVersions } from "@/api/utils/versions";

interface VersionsResponse {
	versions: number[];
}
interface VersionEntry {
	version: number;
}

const OngekiSettingsRoutes = new Hono()
	.post(
		"/update",
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
							WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.OngekiVersion}'
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
	.get("/versions", async (c) => {
		try {
			const userId = c.payload.userId;

			const versions = (await db.query(
				`SELECT DISTINCT version 
       FROM ongeki_profile_data 
       WHERE user = ? 
       ORDER BY version DESC`,
				[userId]
			)) as VersionEntry[];

			return c.json({ versions: versions.map((v) => v.version) } as VersionsResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to get Ongeki versions", error);
		}
	});

export { OngekiSettingsRoutes };
