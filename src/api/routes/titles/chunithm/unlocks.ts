import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

interface UnlockResponse {
	success: boolean;
	message: string;
}

const ChunithmUnlockRoutes = new Hono()
	.post("/settings/songs/unlock", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`UPDATE daphnis_user_option 
             SET value = '1' 
             WHERE user = ? AND \`key\` = 'unlock_all_songs'`,
				[userId]
			);

			return c.json({ success: true, message: "Successfully unlocked all songs" } as UnlockResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to unlock all songs", error);
		}
	})
	.post("/settings/songs/lock", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`UPDATE daphnis_user_option 
             SET value = '0' 
             WHERE user = ? AND \`key\` = 'unlock_all_songs'`,
				[userId]
			);

			return c.json({ success: true, message: "Successfully locked songs" } as UnlockResponse);
		} catch (error) {
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

			return c.json({ success: true, message: "Successfully enabled unlimited tickets" } as UnlockResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to enable unlimited tickets", error);
		}
	})
	.post("/settings/tickets/limited", async (c) => {
		try {
			const userId = c.payload.userId;

			await db.query(
				`UPDATE daphnis_user_option 
             SET value = '0' 
             WHERE user = ? AND \`key\` = 'max_tickets'`,
				[userId]
			);

			return c.json({ success: true, message: "Successfully disabled unlimited tickets" } as UnlockResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to disable unlimited tickets", error);
		}
	});

export { ChunithmUnlockRoutes };
