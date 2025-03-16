import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { ChunithmAvatarCategory } from "@/api/types/enums";
import { rethrowWithMessage } from "@/api/utils/error";

interface AvatarCurrent {
	skin: string;
	back: string;
	face: string;
	head: string;
	item: string;
	wear: string;
}

interface AvatarPartItem {
	image: string;
	label: string;
	avatarAccessoryId: number;
}

interface AvatarPartsGrouped {
	wear: AvatarPartItem[];
	head: AvatarPartItem[];
	face: AvatarPartItem[];
	item: AvatarPartItem[];
	back: AvatarPartItem[];
}

const AvatarRoutes = new Hono()
	.get("/avatar/current", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const [result] = await db.select<AvatarCurrent>(
				`
					WITH ProfileData AS (
						SELECT 
							avatarSkin, 
							avatarBack, 
							avatarFace, 
							avatarHead, 
							avatarItem, 
							avatarWear,
							user, 
							version
						FROM chuni_profile_data
						WHERE user = ? AND version = ?
					),
					StaticAvatarData AS (
						SELECT 
							avatarAccessoryId as Id,
							texturePath,
							version
						FROM chuni_static_avatar
						WHERE version = ?
						AND avatarAccessoryId IN (
							SELECT avatarSkin FROM ProfileData
							UNION
							SELECT avatarBack FROM ProfileData
							UNION
							SELECT avatarFace FROM ProfileData
							UNION
							SELECT avatarHead FROM ProfileData
							UNION
							SELECT avatarItem FROM ProfileData
							UNION
							SELECT avatarWear FROM ProfileData
						)
					)
					SELECT 
						/*
							pd.avatarBack, 
							pd.avatarFace, 
							pd.avatarHead, 
							pd.avatarItem, 
							pd.avatarSkin, 
							pd.avatarWear,
							back.id  AS avatarBackId,
							face.id  AS avatarFaceId,
							head.id  AS avatarHeadId,
							item.id  AS avatarItemId,
							skin.id  AS avatarSkinId,
							wear.id  AS avatarWearId,
						*/
						back.texturePath AS back,
						face.texturePath AS face,
						head.texturePath AS head,
						item.texturePath AS item,
						skin.texturePath AS skin,
						wear.texturePath AS wear
					FROM 
						ProfileData pd
					LEFT JOIN StaticAvatarData skin ON skin.id = pd.avatarSkin AND skin.version = pd.version
					LEFT JOIN StaticAvatarData back ON back.id = pd.avatarBack AND back.version = pd.version
					LEFT JOIN StaticAvatarData face ON face.id  = pd.avatarFace AND face.version = pd.version
					LEFT JOIN StaticAvatarData head ON head.id  = pd.avatarHead AND head.version = pd.version
					LEFT JOIN StaticAvatarData item ON item.id  = pd.avatarItem AND item.version = pd.version
					LEFT JOIN StaticAvatarData wear ON wear.id  = pd.avatarWear AND wear.version = pd.version
     			`,
				[userId, version, version]
			);

			for (const k in result) {
				const key = k as keyof AvatarCurrent;
				if (result[key] === null) {
					result[key] = "";
				}
				result[key] = result[key].replace(".dds", "");
			}
			return c.json(result);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current avatar", error);
		}
	})

	.post(
		"/avatar/update",
		validateJson(
			z.object({
				head: z.number(),
				face: z.number(),
				back: z.number(),
				wear: z.number(),
				item: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const version = versions.chunithm_version;

				const { avatarParts } = await c.req.json();
				const { head, face, back, wear, item } = avatarParts;

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
					[head, face, back, wear, item, userId, version]
				);

				if (result.affectedRows === 0) {
					throw new HTTPException(404);
				}
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to update avatar", error);
			}
		}
	)

	.get("/avatar/parts/all", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const unlockedParts = await db.select<DB.ChuniStaticAvatar>(
				`
					SELECT csa.*
					FROM chuni_static_avatar csa 
					JOIN chuni_item_item cii ON csa.avatarAccessoryId = cii.itemId
					WHERE 
						csa.version = ?
					AND cii.user = ?
					AND cii.itemKind = 11
				`,
				[version, userId]
			);

			const result: AvatarPartsGrouped = {
				wear: [],
				head: [],
				face: [],
				item: [],
				back: [],
			};

			for (const part of unlockedParts) {
				const { avatarAccessoryId, category, name, texturePath } = part;
				const p: AvatarPartItem = {
					avatarAccessoryId: Number(avatarAccessoryId),
					image: texturePath?.replace(".dds", "") || "",
					label: name || "",
				};
				switch (category) {
					case ChunithmAvatarCategory.BACK:
						result.back.push(p);
						break;
					case ChunithmAvatarCategory.FACE:
						result.face.push(p);
						break;
					case ChunithmAvatarCategory.HEAD:
						result.head.push(p);
						break;
					case ChunithmAvatarCategory.ITEM:
						result.item.push(p);
						break;
					case ChunithmAvatarCategory.WEAR:
						result.wear.push(p);
						break;
				}
			}
			return c.json(result);
		} catch (error) {
			throw rethrowWithMessage("Failed to get all avatar parts", error);
		}
	});

export { AvatarRoutes };
