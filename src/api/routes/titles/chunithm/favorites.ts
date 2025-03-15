import { Hono } from "hono";

import { db } from "@/api/db";
import { notFoundWithMessage, rethrowWithMessage, successWithMessage } from "@/api/utils/http-wrappers";

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
				return c.json(notFoundWithMessage("Favorite not found", result));
			}
			return c.json(successWithMessage("Favorite added successfully", result));
		} catch (error) {
			console.error("Error adding favorite:", error);
			return c.json(rethrowWithMessage("Failed to add favorite", error));
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
				return c.json(notFoundWithMessage("Favorite not found", result));
			}
			return c.json(successWithMessage("Favorite removed successfully", result));
		} catch (error) {
			console.error("Error removing favorite:", error);
			return c.json(rethrowWithMessage("Failed to remove favorite", error));
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
			return c.json(rethrowWithMessage("Failed to fetch favorites", error));
		}
	});
export { FavoritesRoutes };
