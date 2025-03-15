import { Hono } from "hono";

import { db } from "@/api/db";
import { rethrowWithMessage } from "@/api/utils/error";

import { getUserVersionChunithm } from "../../../version";

interface AddFavoriteRequest {
	favId: number;
}

interface RemoveFavoriteRequest {
	favId: number;
}

interface FavoriteResult {
	favId: number;
}

interface FavoritesResponse {
	results: FavoriteResult[];
}

const FavoritesRoutes = new Hono()

	.post("/favorites/add", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { favId } = await c.req.json<AddFavoriteRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`INSERT INTO chuni_item_favorite (user, version, favId, favKind)
       VALUES (?, ?, ?, 1)`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return new Response(null, { status: 400 });
			}
			return new Response(null, { status: 200 });
		} catch (error) {
			console.error("Error adding favorite:", error);
			return new Response(null, { status: 500 });
		}
	})

	.post("/favorites/remove", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const { favId } = await c.req.json<RemoveFavoriteRequest>();
			const version = await getUserVersionChunithm(userId);

			const result = await db.query(
				`DELETE FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favId = ? AND favKind = 1`,
				[userId, version, favId]
			);

			if (result.affectedRows === 0) {
				return new Response("not found", { status: 404 });
			}
			return new Response("success", { status: 200 });
		} catch (error) {
			console.error("Error removing favorite:", error);
			return new Response("error", { status: 500 });
		}
	})

	.get("/favorites/all", async (c): Promise<Response> => {
		try {
			const userId = c.payload.userId;

			const version = await getUserVersionChunithm(userId);

			const results = (await db.query(
				`SELECT favId 
       FROM chuni_item_favorite
       WHERE user = ? AND version = ? AND favKind = 1`,
				[userId, version]
			)) as FavoriteResult[];

			return c.json({ results } as FavoritesResponse);
		} catch (error) {
			throw rethrowWithMessage("Failed to get favorites", error);
		}
	});
export { FavoritesRoutes };
