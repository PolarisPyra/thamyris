import { Hono } from "hono";
import { z } from "zod";

import { validateJson } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { rethrowWithMessage } from "@/api/utils/error";

import { db } from "../../../db";

export const TrophyRoutes = new Hono()

	.get("current", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;

			const results = await db.select<DB.ChuniProfileData>(
				`SELECT 
          trophyId,
          trophyIdSub1,
          trophyIdSub2,
          version
        FROM chuni_profile_data
        WHERE user = ? AND version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get current trophies", error);
		}
	})

	.get("unlocked", async (c) => {
		try {
			const { userId, versions } = c.payload;
			const version = versions.chunithm_version;
			const results = await db.select<DB.DaphnisStaticTrophy>(
				`SELECT dst.id, dst.version, dst.trophyId, dst.name, dst.rareType, dst.imagePath
   					FROM daphnis_static_trophy dst
   					INNER JOIN chuni_item_item cii ON dst.trophyId = cii.itemId
   					WHERE cii.itemKind = 3 
  				  AND cii.user = ?
 					  AND dst.version = ?`,
				[userId, version]
			);

			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get unlocked trophies", error);
		}
	})

	.post(
		"update",
		validateJson(
			z.object({
				mainTrophyId: z.number().nullable().optional(),
				subTrophy1Id: z.number().nullable().optional(),
				subTrophy2Id: z.number().nullable().optional(),
			})
		),
		async (c) => {
			try {
				const { userId, versions } = c.payload;
				const version = versions.chunithm_version;
				const body = await c.req.json();

				// Check if any trophy fields are provided
				if (!("mainTrophyId" in body || "subTrophy1Id" in body || "subTrophy2Id" in body)) {
					return c.json({ error: "No trophy updates provided" }, 400);
				}

				const updateFields = [];
				const updateValues = [];

				if ("mainTrophyId" in body) {
					updateFields.push("trophyId = ?");
					updateValues.push(body.mainTrophyId);
				}

				if (version >= 17) {
					if ("subTrophy1Id" in body) {
						updateFields.push("trophyIdSub1 = ?");
						updateValues.push(body.subTrophy1Id);
					}
					if ("subTrophy2Id" in body) {
						updateFields.push("trophyIdSub2 = ?");
						updateValues.push(body.subTrophy2Id);
					}
				}

				const update = await db.query(
					`UPDATE chuni_profile_data 
                SET ${updateFields.join(", ")}
                WHERE user = ? AND version = ?`,
					[...updateValues, userId, version]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to update trophies", error);
			}
		}
	);
