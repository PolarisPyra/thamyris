import { Hono } from "hono";

import { db } from "@/api/db";
import { DaphnisUserOptionKey } from "@/api/types/db";
import { rethrowWithMessage } from "@/api/utils/error";

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

	.get("/get", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to get current version", error);
		}
	})
	.post("/update", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to update settings", error);
		}
	})
	.get("/versions", async (c): Promise<Response> => {
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
			throw rethrowWithMessage("Failed to get versions", error);
		}
	})

	/**
	 * Unlock endpoints
	 */

	.post("/songs/unlock", async (c) => {
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
	.post("/songs/lock", async (c) => {
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
	.post("/tickets/unlimited", async (c) => {
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
	.post("/tickets/limited", async (c) => {
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
