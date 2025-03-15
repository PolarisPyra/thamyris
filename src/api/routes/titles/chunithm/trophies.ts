import { Hono } from "hono";

import { db } from "../../../db";
import { getUserVersionChunithm } from "../../../version";

interface CurrentTrophyResponse {
	data?: {
		trophyId: number | null;
		trophyIdSub1: number | null;
		trophyIdSub2: number | null;
		version: number;
	};
}

interface UnlockedTrophyResponse {
	data?: Array<{
		id: number;
		name: string;
		rareType: number;
		trophyId: number;
	}>;
}

interface UpdateTrophyRequest {
	mainTrophyId?: number | null;
	subTrophy1Id?: number | null;
	subTrophy2Id?: number | null;
}

const TrophyRoutes = new Hono()
	.get("/trophies/current", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);

			const rows = await db.query<
				{
					trophyId: number | null;
					trophyIdSub1: number | null;
					trophyIdSub2: number | null;
					version: number;
				}[]
			>(
				`SELECT 
          trophyId,
          trophyIdSub1,
          trophyIdSub2,
          version
        FROM chuni_profile_data
        WHERE user = ? AND version = ?`,
				[userId, version]
			);

			if (!rows || rows.length === 0) {
				return new Response("not found", { status: 404 });
			}

			return c.json<CurrentTrophyResponse>({
				data: rows[0],
			});
		} catch (error) {
			console.error("[Chunithm Trophy] Error fetching current trophies:", error);
			return new Response("error", { status: 500 });
		}
	})

	.get("/trophies/unlocked", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);

			const unlockedResults = await db.query<Array<{ itemId: number }>>(
				`SELECT itemId 
        FROM chuni_item_item 
        WHERE itemKind = 3 AND user = ?`,
				[userId]
			);

			if (!unlockedResults || unlockedResults.length === 0) {
				return c.json<UnlockedTrophyResponse>({
					data: [],
				});
			}

			const unlockedTrophyIds = unlockedResults.map((item) => item.itemId);

			const trophyResults = await db.query<
				Array<{
					id: number;
					name: string;
					rareType: number;
					trophyId: number;
				}>
			>(
				`SELECT id, name, rareType, trophyId
        FROM daphnis_static_trophy
        WHERE trophyId IN (?) AND version = ?`,
				[unlockedTrophyIds, version]
			);

			return c.json<UnlockedTrophyResponse>({
				data: trophyResults,
			});
		} catch (error) {
			console.error("[Chunithm Trophy] Error fetching unlocked trophies:", error);
			return new Response("error", { status: 500 });
		}
	})

	.post("/trophies/update", async (c) => {
		try {
			const userId = c.payload.userId;
			const version = await getUserVersionChunithm(userId);
			const body = await c.req.json<UpdateTrophyRequest>();

			const updateFields: string[] = [];
			const updateValues: (number | null)[] = [];

			if ("mainTrophyId" in body) {
				updateFields.push("trophyId = ?");
				updateValues.push(body.mainTrophyId ?? null);
			}

			if (parseInt(version) >= 17) {
				if ("subTrophy1Id" in body) {
					updateFields.push("trophyIdSub1 = ?");
					updateValues.push(body.subTrophy1Id ?? null);
				}
				if ("subTrophy2Id" in body) {
					updateFields.push("trophyIdSub2 = ?");
					updateValues.push(body.subTrophy2Id ?? null);
				}
			}

			if (updateFields.length === 0) {
				return new Response("no trophy updates provided", { status: 400 });
			}

			const result = await db.query<{ affectedRows: number }>(
				`UPDATE chuni_profile_data 
        SET ${updateFields.join(", ")}
        WHERE user = ? AND version = ?`,
				[...updateValues, userId, version]
			);

			if (!result || result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}

			return new Response("success", { status: 200 });
		} catch (error) {
			console.error("[Chunithm Trophy] Error updating trophies:", error);
			return new Response("error", { status: 500 });
		}
	});

export default TrophyRoutes;
