import { Hono } from "hono";

import { db } from "@/api/db";

import { getUserVersionChunithm } from "../../../version";

interface AddFavoriteRequest {
	favId: number;
}

interface AddFavoriteResponse {
	success: boolean;
}

interface AddFavoriteErrorResponse {
	error: string;
}

interface RemoveFavoriteRequest {
	favId: number;
}

interface RemoveFavoriteResponse {
	success: boolean;
}

interface RemoveFavoriteErrorResponse {
	error: string;
}

interface FavoritesErrorResponse {
	error: string;
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
				return c.json({ error: "Failed to add favorite" } as AddFavoriteErrorResponse, 400);
			}
			return c.json({ success: true } as AddFavoriteResponse);
		} catch (error) {
			console.error("Error adding favorite:", error);
			return c.json({ error: "Failed to add favorite" } as AddFavoriteErrorResponse, 500);
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
				return c.json({ error: "Favorite not found" } as RemoveFavoriteErrorResponse, 404);
			}
			return c.json({ success: true } as RemoveFavoriteResponse);
		} catch (error) {
			console.error("Error removing favorite:", error);
			return c.json({ error: "Failed to remove favorite" } as RemoveFavoriteErrorResponse, 500);
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
			console.error("Error fetching favorites:", error);
			return c.json({ error: "Failed to fetch favorites" } as FavoritesErrorResponse, 500);
		}
	});
export { FavoritesRoutes };
