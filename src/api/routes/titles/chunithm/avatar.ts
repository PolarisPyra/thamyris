import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionChunithm } from "../../../version";
import { env } from "@/env";
import type { Context } from "hono";

const AvatarRoutes = new Hono()

	.get("/avatar/current", async (c: Context) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = await db.query(
				`
SELECT 
    saSkin.avatarAccessoryId AS avatarSkinId,
    saSkin.texturePath AS avatarSkinTexture,
    saBack.avatarAccessoryId AS avatarBackId,
    saBack.texturePath AS avatarBackTexture,
    saFace.avatarAccessoryId AS avatarFaceId,
    saFace.texturePath AS avatarFaceTexture,
    saHead.avatarAccessoryId AS avatarHeadId,
    saHead.texturePath AS avatarHeadTexture,
    saItem.avatarAccessoryId AS avatarItemId,
    saItem.texturePath AS avatarItemTexture,
    saWear.avatarAccessoryId AS avatarWearId,
    saWear.texturePath AS avatarWearTexture,
    cp.avatarSkin, cp.avatarBack, cp.avatarFace, 
    cp.avatarHead, cp.avatarItem, cp.avatarWear
FROM chuni_profile_data cp
LEFT JOIN chuni_static_avatar saSkin 
    ON saSkin.avatarAccessoryId = cp.avatarSkin 
    AND saSkin.version = cp.version
LEFT JOIN chuni_static_avatar saBack 
    ON saBack.avatarAccessoryId = cp.avatarBack 
    AND saBack.version = cp.version
LEFT JOIN chuni_static_avatar saFace 
    ON saFace.avatarAccessoryId = cp.avatarFace 
    AND saFace.version = cp.version
LEFT JOIN chuni_static_avatar saHead 
    ON saHead.avatarAccessoryId = cp.avatarHead 
    AND saHead.version = cp.version
LEFT JOIN chuni_static_avatar saItem 
    ON saItem.avatarAccessoryId = cp.avatarItem 
    AND saItem.version = cp.version
LEFT JOIN chuni_static_avatar saWear 
    ON saWear.avatarAccessoryId = cp.avatarWear 
    AND saWear.version = cp.version
WHERE cp.user = ? 
AND cp.version = ?;

      `,
				[userId, version]
			);
			return c.json({ results });
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch avatar parts" }, 500);
		}
	})

	.post("/avatar/update", async (c: Context) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const { avatarParts } = await c.req.json();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`
        UPDATE chuni_profile_data
        SET
          avatarHead = ?,
          avatarFace = ?,
          avatarBack = ?,
          avatarWear = ?,
          avatarItem = ?
        WHERE user = ? AND version = ?
        `,
				[
					avatarParts.head,
					avatarParts.face,
					avatarParts.back,
					avatarParts.wear,
					avatarParts.item,
					userId,
					version,
				]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found for this version" }, 404);
			}
			return c.json({ success: true });
		} catch (error) {
			console.error("Error updating avatar:", error);
			return c.json({ error: "Failed to update avatar" }, 500);
		}
	})

	.get("/avatar/parts/all", async (c: Context) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, env.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);

			// Get unlocked avatar parts
			const unlockedResults = await db.query(
				`SELECT itemId 
				FROM chuni_item_item 
				WHERE itemKind = 11 AND user = ?`,
				[userId]
			);

			const unlockedParts = unlockedResults.map((item: { itemId: number }) => item.itemId);

			// Get all avatar parts
			const allParts = await db.query(
				`SELECT 
					id,
					name,
					avatarAccessoryId,
					category,
					version,
					iconPath,
					texturePath
				FROM chuni_static_avatar
				WHERE version = ?`,
				[version]
			);

			// Filter unlocked parts and group by category
			const groupedResults = allParts
				.filter((part: { avatarAccessoryId: number }) => unlockedParts.includes(part.avatarAccessoryId))
				.reduce((acc: any, item: any) => {
					const categoryMap: Record<number, string> = {
						1: "wear",
						2: "head",
						3: "face",
						5: "item",
						7: "back",
					};

					const category = categoryMap[item.category];
					if (category) {
						if (!acc[category]) {
							acc[category] = [];
						}
						acc[category].push({
							image: item.texturePath?.replace(".dds", "") || "",
							label: item.name,
							avatarAccessoryId: Number(item.avatarAccessoryId),
						});
					}
					return acc;
				}, {});

			return c.json({ results: groupedResults });
		} catch (error) {
			console.error("Error fetching all avatar parts:", error);
			return c.json({ error: "Failed to fetch all avatar parts" }, 500);
		}
	});

export { AvatarRoutes };
