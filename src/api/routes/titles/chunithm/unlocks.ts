import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage, successWithMessage } from "@/api/utils/http-wrappers";

const ChunithmUnlockRoutes = new Hono()
	.post("/settings/songs/unlock", async (c) => {
		try {
			const userId = c.payload.userId;

			const results = await db.query(
				`UPDATE daphnis_user_option 
             SET value = '1' 
             WHERE user = ? AND \`key\` = 'unlock_all_songs'`,
				[userId]
			);

			return c.json(successWithMessage("Successfully unlocked all songs", results));
		} catch (error) {
			console.error("Error unlocking all songs:", error);
			throw rethrowWithMessage("Failed to unlock all songs", error);
		}
	})
	.post("/settings/songs/lock", async (c) => {
		try {
			const userId = c.payload.userId;

			const results = await db.query(
				`UPDATE daphnis_user_option 
             SET value = '0' 
             WHERE user = ? AND \`key\` = 'unlock_all_songs'`,
				[userId]
			);

			return c.json(successWithMessage("Successfully disabled unlimited tickets", results));
		} catch (error) {
			console.error("Error locking songs:", error);
			throw rethrowWithMessage("Failed to lock songs", error);
		}
	})
	.post("/settings/tickets/unlimited", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`UPDATE daphnis_user_option 
             SET value = '1' 
             WHERE user = ? AND \`key\` = 'max_tickets'`,
				[userId]
			);

			return c.json(
				successWithMessage("Successfully enabled unlimited tickets", "Successfully enabled unlimited tickets")
			);
		} catch (error) {
			console.error("Error enabling unlimited tickets:", error);
			throw rethrowWithMessage("Failed to enable unlimited tickets", error);
		}
	})
	.post("/settings/tickets/limited", async (c) => {
		try {
			const userId = c.payload.userId;

			const results = await db.query(
				`UPDATE daphnis_user_option 
             SET value = '0' 
             WHERE user = ? AND \`key\` = 'max_tickets'`,
				[userId]
			);

			return c.json(successWithMessage("Successfully disabled unlimited tickets", results));
		} catch (error) {
			console.error("Error disabling unlimited tickets:", error);
			throw rethrowWithMessage("Failed to disable unlimited tickets", error);
		}
	});

export { ChunithmUnlockRoutes };
