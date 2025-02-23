import { db } from "@/api";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getUserVersionChunithm } from "../../../version";
import { config } from "@/env";

const AvatarRoutes = new Hono()

	.get("/avatar/current", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, config.JWT_SECRET);
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

	.post("/avatar/update", async (c) => {
		try {
			const token = getCookie(c, "auth_token");
			if (!token) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const payload = await verify(token, config.JWT_SECRET);
			const userId = payload.userId;
			const version = await getUserVersionChunithm(userId);
			const { avatarParts } = await c.req.json();

			const results = await db.query(
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

			return c.json({ success: true, results });
		} catch (error) {
			console.error("Error updating avatar:", error);
			return c.json({ error: "Failed to update avatar" }, 500);
		}
	})

	.get("/avatar/parts/:category", async (c) => {
		const token = getCookie(c, "auth_token");
		if (!token) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const payload = await verify(token, config.JWT_SECRET);
		const userId = payload.userId;
		const version = await getUserVersionChunithm(userId);
		const category = Number(c.req.param("category"));
		try {
			const results = await db.query(
				`
        SELECT
          csa.id,
          csa.name,
          csa.avatarAccessoryId,
          csa.category,
          csa.version,
          csa.iconPath,
          csa.texturePath
        FROM chuni_static_avatar AS csa
        INNER JOIN (
            SELECT itemId
            FROM chuni_item_item
            WHERE itemKind = 11 AND user = ?
        ) AS i
        ON csa.avatarAccessoryId = i.itemId
        WHERE csa.category = ? AND csa.version = ?
        `,
				[userId, category, version]
			);

			return c.json({
				results: results.map((item: { avatarAccessoryId: any }) => ({
					...item,
					avatarAccessoryId: item.avatarAccessoryId,
				})),
			});
		} catch (error) {
			console.error("Database query error:", error);
			return c.json({ error: "Database query failed" }, 500);
		}
	});

export { AvatarRoutes };
