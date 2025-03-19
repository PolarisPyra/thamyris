import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB, DaphnisUserOptionKey } from "@/api/types/db";
import { signAndSetCookie } from "@/api/utils/cookie";
import { rethrowWithMessage } from "@/api/utils/error";
import { getUserGameVersions } from "@/api/utils/versions";

interface VersionResponse {
	version: string;
}

interface VersionsResponse {
	versions: number[];
}

interface VersionResult {
	value: string;
}

interface VersionEntry {
	version: number;
}

const OngekiSettingsRoutes = new Hono()

	.get("get", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const [versionResult] = (await db.query(
				`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'ongeki_version'`,
				[userId]
			)) as VersionResult[];

			return c.json({ version: versionResult?.value ?? "No version" } as VersionResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to get Ongeki version", error);
		}
	})
	.post(
		"update",
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

					// console.log("UserId:", userId);
					// console.log("AimeCardId:", aimeCardId, "Type:", typeof aimeCardId);

					const result = await db.update(
						`
        UPDATE daphnis_user_option 
        SET value = ?
        WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.OngekiVersion}'
        `,
						[version, userId]
					);
					if (result.affectedRows === 0) {
						throw rethrowWithMessage("Nothing to be updated", 500);
					}

					// Gotta update the cookie now that the version has changed
					const [user] = await conn.select<DB.AimeUser>("SELECT id FROM aime_user WHERE id = ?", [userId]);
					// console.log("User:", user);
					// console.log("AimeCardId:", aimeCardId);
					const [card] = await conn.select<DB.AimeCard>("SELECT access_code FROM aime_card WHERE accesss_code = ?", [
						aimeCardId,
					]);
					// console.log("Card:", card);
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
	.get("versions", async (c): Promise<Response> => {
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
