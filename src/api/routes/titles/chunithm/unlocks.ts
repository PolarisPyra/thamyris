import { Hono } from "hono";

import { db } from "@/api/db";

interface UnlockResponse {
	success: boolean;
	message: string;
}

interface UnlockErrorResponse {
	error: string;
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
			console.error("Error unlocking all songs:", error);
			return c.json({ error: "Failed to unlock all songs" } as UnlockErrorResponse, 500);
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
			console.error("Error locking songs:", error);
			return c.json({ error: "Failed to lock songs" } as UnlockErrorResponse, 500);
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
			console.error("Error enabling unlimited tickets:", error);
			return c.json({ error: "Failed to enable unlimited tickets" } as UnlockErrorResponse, 500);
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
			console.error("Error disabling unlimited tickets:", error);
			return c.json({ error: "Failed to disable unlimited tickets" } as UnlockErrorResponse, 500);
		}
	});

export { ChunithmUnlockRoutes };
