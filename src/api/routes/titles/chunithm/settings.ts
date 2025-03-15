import { Hono } from "hono";

import { db } from "@/api/db";

interface SettingsGetResponse {
	version: string;
}

interface SettingsUpdateRequest {
	version: string | number;
}

interface SettingsUpdateResponse {
	success: boolean;
	version: string | number;
	message: string;
}

interface VersionEntry {
	version: number;
}

interface SettingsVersionsResponse {
	versions: number[];
}

const ChunithmSettingsRoutes = new Hono()

	.get("/settings/get", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const [versionResult] = (await db.query(
				`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'chunithm_version'`,
				[userId]
			)) as [{ value: string } | undefined];

			return c.json({ version: versionResult?.value || "No Version" } as SettingsGetResponse);
		} catch (error) {
			console.error("Error getting current version:", error);
			return new Response(null, { status: 500 });
		}
	})
	.post("/settings/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { version } = await c.req.json<SettingsUpdateRequest>();

			const result = await db.query(
				`UPDATE daphnis_user_option 
       SET value = ?
       WHERE user = ? AND \`key\` = 'chunithm_version'`,
				[version, userId]
			);

			if (result.affectedRows === 0) {
				return new Response(null, { status: 404 });
			}

			return c.json({
				success: true,
				version,
				message: "Successfully updated game version",
			} as SettingsUpdateResponse);
		} catch (error) {
			console.error("Error updating settings:", error);
			return new Response(null, { status: 500 });
		}
	})
	.get("/settings/versions", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const versions = (await db.query(
				`SELECT DISTINCT version 
       FROM chuni_profile_data 
       WHERE user = ? 
       ORDER BY version DESC`,
				[userId]
			)) as VersionEntry[];

			return c.json({ versions: versions.map((v) => v.version) } as SettingsVersionsResponse);
		} catch (error) {
			console.error("Error getting versions:", error);
			return new Response("error", { status: 500 });
		}
	});

export { ChunithmSettingsRoutes };
