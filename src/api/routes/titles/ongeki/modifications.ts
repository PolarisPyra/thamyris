import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

interface CardCountResult {
	cards: number;
	level: number;
}

const OngekiModsRoutes = new Hono()
	.post(
		"unlockcards",
		validateJson(
			z.object({
				version: z.number().min(1),
			})
		),
		async (c) => {
			try {
				const [result] = await db.inTransaction<CardCountResult[]>(async (db) => {
					const userId = c.payload.userId;
					const { version } = await c.req.json();
					const insert: Partial<Record<keyof DB.OngekiUserCard, any>> = {
						user: "?",
						cardId: "cardId",
						digitalStock: 5,
						analogStock: 0,
						level: 70,
						maxLevel: 70,
						exp: 0,
						printCount: 0,
						useCount: 0,
						isNew: 0,
						kaikaDate: '"2021-01-01 00:00:00.0"',
						choKaikaDate: '"2021-01-01 00:00:00.0"',
						skillId: "choKaikaSkillId",
						isAcquired: 1,
						created: '"2021-01-01 00:00:00.0"',
					};
					await db.query(
						`
							INSERT INTO ongeki_user_card 
								(${Object.keys(insert).join(", ")})
							SELECT 
								${Object.values(insert).join(", ")}
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

					return await db.select<CardCountResult>(
						`
						SELECT COUNT(id) AS cards, level
						FROM ongeki_user_card
						WHERE user = ?
						GROUP BY level
					`,
						[userId]
					);
				});

				// Return the card count result as JSON, but with a success status code
				return c.json({ result });
			} catch (error) {
				throw rethrowWithMessage("Failed to unlock Ongeki cards", error);
			}
		}
	)

	.post(
		"unlockspecificitem",
		validateJson(
			z.object({
				itemKind: z.number(),
				version: z.string(),
			})
		),
		async (c) => {
			try {
				const userId = c.payload.userId;
				const { itemKind, version } = await c.req.json();

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

				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to unlock specific Ongeki item", error);
			}
		}
	)

	.post("unlockallitems", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.ongeki_version;

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
			return new Response();
		} catch (error) {
			throw rethrowWithMessage("Failed to unlock all Ongeki items", error);
		}
	});

export { OngekiModsRoutes };
