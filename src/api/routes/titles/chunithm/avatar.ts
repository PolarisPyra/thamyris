import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

interface AvatarCurrentErrorResponse {
	error: string;
}

interface AvatarCurrentResult {
	avatarSkinId: number;
	avatarSkinTexture: string;
	avatarBackId: number;
	avatarBackTexture: string;
	avatarFaceId: number;
	avatarFaceTexture: string;
	avatarHeadId: number;
	avatarHeadTexture: string;
	avatarItemId: number;
	avatarItemTexture: string;
	avatarWearId: number;
	avatarWearTexture: string;
	avatarSkin: number;
	avatarBack: number;
	avatarFace: number;
	avatarHead: number;
	avatarItem: number;
	avatarWear: number;
}

interface AvatarUpdateRequest {
	avatarParts: {
		head: number;
		face: number;
		back: number;
		wear: number;
		item: number;
	};
}

interface AvatarUpdateResponse {
	success: boolean;
}

interface AvatarUpdateErrorResponse {
	error: string;
}

interface AvatarPartsErrorResponse {
	error: string;
}

interface AvatarPartItem {
	image: string;
	label: string;
	avatarAccessoryId: number;
}

interface AvatarUnlockedItem {
	itemId: number;
}

interface AvatarStaticItem {
	id: number;
	name: string;
	avatarAccessoryId: number;
	category: number;
	version: number;
	iconPath: string;
	texturePath: string;
}

interface AvatarCurrentResponse {
	results: AvatarCurrentResult[];
}

interface AvatarPartsResponse {
	results: {
		wear?: AvatarPartItem[];
		head?: AvatarPartItem[];
		face?: AvatarPartItem[];
		item?: AvatarPartItem[];
		back?: AvatarPartItem[];
	};
}

interface AvatarPartsGrouped {
	wear?: AvatarPartItem[];
	head?: AvatarPartItem[];
	face?: AvatarPartItem[];
	item?: AvatarPartItem[];
	back?: AvatarPartItem[];
}

interface AvatarPartsResponse {
	results: AvatarPartsGrouped;
}

const AvatarRoutes = new Hono()

	.get("/avatar/current", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const results = (await db.query(
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
			)) as AvatarCurrentResult[];
			return c.json({ results } as AvatarCurrentResponse);
		} catch (error) {
			console.error("Error executing query:", error);
			return c.json({ error: "Failed to fetch avatar parts" } as AvatarCurrentErrorResponse, 500);
		}
	})

	.post("/avatar/update", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { avatarParts } = await c.req.json<AvatarUpdateRequest>();
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
				[avatarParts.head, avatarParts.face, avatarParts.back, avatarParts.wear, avatarParts.item, userId, version]
			);

			if (result.affectedRows === 0) {
				return c.json({ error: "Profile not found for this version" } as AvatarUpdateErrorResponse, 404);
			}
			return c.json({ success: true } as AvatarUpdateResponse);
		} catch (error) {
			console.error("Error updating avatar:", error);
			return c.json({ error: "Failed to update avatar" } as AvatarUpdateErrorResponse, 500);
		}
	})

	.get("/avatar/parts/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const unlockedResults = (await db.query(
				`SELECT itemId 
        FROM chuni_item_item 
        WHERE itemKind = 11 AND user = ?`,
				[userId]
			)) as AvatarUnlockedItem[];

			const unlockedParts = unlockedResults.map((item) => item.itemId);

			const allParts = (await db.query(
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
			)) as AvatarStaticItem[];

			const groupedResults = allParts
				.filter((part) => unlockedParts.includes(part.avatarAccessoryId))
				.reduce((acc: AvatarPartsGrouped, item: AvatarStaticItem) => {
					const categoryMap: Record<number, string> = {
						1: "wear",
						2: "head",
						3: "face",
						5: "item",
						7: "back",
					};

					const category = categoryMap[item.category] as keyof AvatarPartsGrouped;
					if (category) {
						if (!acc[category]) {
							acc[category] = [];
						}
						acc[category]!.push({
							image: item.texturePath?.replace(".dds", "") || "",
							label: item.name,
							avatarAccessoryId: Number(item.avatarAccessoryId),
						});
					}
					return acc;
				}, {});

			return c.json({ results: groupedResults } as AvatarPartsResponse);
		} catch (error) {
			console.error("Error fetching all avatar parts:", error);
			return c.json({ error: "Failed to fetch all avatar parts" } as AvatarPartsErrorResponse, 500);
		}
	});

export { AvatarRoutes };
