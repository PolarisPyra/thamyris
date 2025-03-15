import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/http-wrappers";

interface VersionResponse {
	version: string;
}

interface VersionUpdateRequest {
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

	.get("/settings/get", async (c): Promise<Response> => {
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
			console.error("Error getting current version:", error);
			throw rethrowWithMessage("Failed to get current version", error);
		}
	})
	.post("/settings/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { version } = await c.req.json<VersionUpdateRequest>();

			const result = await db.query(
				`UPDATE daphnis_user_option 
       SET value = ?
       WHERE user = ? AND \`key\` = 'ongeki_version'`,
				[version, userId]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}

			return new Response("success", { status: 200 });
		} catch (error) {
			console.error("Error updating settings:", error);
			throw rethrowWithMessage("Failed to update settings", error);
		}
	})
	.get("/settings/versions", async (c): Promise<Response> => {
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
			console.error("Error getting versions:", error);
			throw rethrowWithMessage("Failed to get versions", error);
		}
	});

export { OngekiSettingsRoutes };
