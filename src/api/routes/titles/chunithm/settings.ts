import { Hono } from "hono";

import { db } from "@/api/db";

const ChunithmSettingsRoutes = new Hono()

	.get("/settings/get", async (c) => {
		try {
			const userId = c.payload.userId;

			const [versionResult] = await db.query(
				`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'chunithm_version'`,
				[userId]
			);

			return c.json({ version: versionResult?.value || "No Version" });
		} catch (error) {
			console.error("Error getting current version:", error);
			return c.json({ error: "Failed to get current version" }, 500);
		}
	})
	.post("/settings/update", async (c) => {
		try {
			const userId = c.payload.userId;

			const { version } = await c.req.json();

			const result = await db.query(
				`UPDATE daphnis_user_option 
       SET value = ?
       WHERE user = ? AND \`key\` = 'chunithm_version'`,
				[version, userId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found" }, 404);
			}

			return c.json({ success: true, version, message: "Successfully updated game version" });
		} catch (error) {
			console.error("Error updating settings:", error);
			return c.json({ error: "Failed to update settings" }, 500);
		}
	})
	.get("/settings/versions", async (c) => {
		try {
			const userId = c.payload.userId;

			const versions = await db.query(
				`SELECT DISTINCT version 
       FROM chuni_profile_data 
       WHERE user = ? 
       ORDER BY version DESC`,
				[userId]
			);

			return c.json({ versions: versions.map((v: { version: number }) => v.version) });
		} catch (error) {
			console.error("Error getting versions:", error);
			return c.json({ error: "Failed to get versions" }, 500);
		}
	});

export { ChunithmSettingsRoutes };
