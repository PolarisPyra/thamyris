import { Hono } from "hono";

import { db } from "@/api/db";
import { getUserVersionOngeki } from "@/api/version";

interface UnlockCardsRequest {
	version: string;
}

interface UnlockSpecificItemRequest {
	itemKind: number;
	version: string;
}

interface UnlockResponse {
	success: boolean;
	message: string;
}

interface UnlockCardsResponse extends UnlockResponse {
	result: CardCountResult;
}

interface UnlockErrorResponse {
	error: string;
}

interface CardCountResult {
	cards: number;
	level: number;
}

const OngekiUnlockRoutes = new Hono()

	.post("/unlockcards", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { version } = await c.req.json<UnlockCardsRequest>();

			await db.query(
				`
INSERT INTO ongeki_user_card 
	(user, cardId, digitalStock, analogStock, level, maxLevel, exp, printCount, useCount, isNew, kaikaDate, choKaikaDate, skillId, isAcquired, created)
SELECT 
	?, cardId, 5, 0, 70, 70, 0, 0, 0, 0, "2021-01-01 00:00:00.0", "2021-01-01 00:00:00.0", choKaikaSkillId, 1, "2021-01-01 00:00:00.0"
FROM ongeki_static_cards AS c
WHERE c.version = ?
ON DUPLICATE KEY UPDATE 
	digitalStock = 5,
	level = 70,
	maxLevel = 70,
	kaikaDate = GREATEST("2021-01-01 00:00:00.0", kaikaDate),
	choKaikaDate = GREATEST("2021-01-01 00:00:00.0", choKaikaDate),
	skillId = c.choKaikaSkillId,
	isAcquired = 1,
	created = GREATEST("2021-01-01 00:00:00.0", created)
`,
				[userId, version]
			);

			await db.query(
				`
UPDATE ongeki_user_card uc
INNER JOIN ongeki_static_cards sc ON uc.cardId = sc.cardId
SET 
	digitalStock = 11,
	level = 100,
	maxLevel = 100
WHERE uc.user = ? AND sc.rarity = 0
`,
				[userId]
			);

			const [result] = (await db.query(
				`SELECT COUNT(id) AS cards, level
FROM ongeki_user_card
WHERE user = ?
GROUP BY level`,
				[userId]
			)) as CardCountResult[];

			return c.json({
				message: "Successfully unlocked cards",
				success: true,
				result,
			} as UnlockCardsResponse);
		} catch (error) {
			console.error("Error unlocking cards:", error);
			return c.json({ error: "Failed to unlock cards" } as UnlockErrorResponse, 500);
		}
	})

	.post("/unlockspecificitem", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { itemKind, version } = await c.req.json<UnlockSpecificItemRequest>();

			await db.query(
				`
INSERT IGNORE INTO ongeki_user_item 
	(user, itemKind, itemId, stock, isValid)
SELECT 
	?, itemKind, itemId, 1, 1
FROM ongeki_static_rewards
WHERE version = ? AND itemKind = ?
`,
				[userId, version, itemKind]
			);

			return c.json({
				success: true,
				message: "Successfully unlocked specific item",
			} as UnlockResponse);
		} catch (error) {
			console.error("Error unlocking specific item:", error);
			return c.json({ error: "Failed to unlock specific item" } as UnlockErrorResponse, 500);
		}
	})

	.post("/unlockallitems", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionOngeki(userId);

			const itemKinds = [2, 3, 17, 19];
			for (const itemKind of itemKinds) {
				await db.query(
					`
INSERT IGNORE INTO ongeki_user_item 
	(user, itemKind, itemId, stock, isValid)
SELECT 
	?, itemKind, itemId, 1, 1
FROM ongeki_static_rewards 
WHERE version = ? AND itemKind = ?
`,
					[userId, version, itemKind]
				);
			}

			return c.json({
				success: true,
				message: "Successfully unlocked all items",
			} as UnlockResponse);
		} catch (error) {
			console.error("Error unlocking all items:", error);
			return c.json({ error: "Failed to unlock all items" } as UnlockErrorResponse, 500);
		}
	});

export { OngekiUnlockRoutes };
