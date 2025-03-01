import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { db } from "@/api/db";
import { getUserVersionOngeki } from "@/api/version";
import { env } from "@/env";

const OngekiSettingsRoutes = new Hono()

	.get("/settings/get", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const [versionResult] = await db.query(
				`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'ongeki_version'`,
				[userId]
			);

			return c.json({ version: versionResult?.value || "No version" });
		} catch (error) {
			console.error("Error getting current version:", error);
			return c.json({ error: "Failed to get current version" }, 500);
		}
	})
	.post("/settings/update", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { version } = await c.req.json();

			const result = await db.query(
				`UPDATE daphnis_user_option 
       SET value = ?
       WHERE user = ? AND \`key\` = 'ongeki_version'`,
				[version, userId]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found" }, 404);
			}

			return c.json({ success: true, version });
		} catch (error) {
			console.error("Error updating settings:", error);
			return c.json({ error: "Failed to update settings" }, 500);
		}
	})
	.post("settings/unlockcards", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { version } = await c.req.json();

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

			const [result] = await db.query(
				`SELECT COUNT(id) AS cards, level
       FROM ongeki_user_card
       WHERE user = ?
       GROUP BY level`,
				[userId]
			);

			return c.json({ success: true, result });
		} catch (error) {
			console.error("Error unlocking cards:", error);
			return c.json({ error: "Failed to unlock cards" }, 500);
		}
	})

	.post("settings/unlockspecificitem", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
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

			return c.json({ success: true });
		} catch (error) {
			console.error("Error unlocking specific item:", error);
			return c.json({ error: "Failed to unlock specific item" }, 500);
		}
	})

	.post("settings/unlockallitems", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
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

			return c.json({ success: true });
		} catch (error) {
			console.error("Error unlocking all items:", error);
			return c.json({ error: "Failed to unlock all items" }, 500);
		}
	})
	.get("/settings/versions", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;

			const versions = await db.query(
				`SELECT DISTINCT version 
       FROM ongeki_profile_data 
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

export { OngekiSettingsRoutes };
