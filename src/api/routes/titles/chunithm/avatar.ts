import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

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
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get current avatar", error);
		}
	})

	.post("/avatar/update", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const { avatarParts } = await c.req.json<AvatarUpdateRequest>();

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
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			throw rethrowWithMessage("Failed to update avatar", error);
		}
	})

	.get("/avatar/parts/all", async (c): Promise<Response> => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

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
			throw rethrowWithMessage("Failed to get all avatar parts", error);
		}
	});

export { AvatarRoutes };
