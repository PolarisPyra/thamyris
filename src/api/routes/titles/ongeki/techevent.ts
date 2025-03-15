import { Hono } from "hono";
import { z } from "zod";

import db from "@/api/db";
import { validateJson, validateQuery } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { DaphnisUserOptionKey } from "@/api/types/db";
import { rethrowWithMessage } from "@/api/utils/error";

type TechEvent = DB.OngekiStaticEvents & {
	ownerUserId: string | null;
	ownerUsername: string | null;
	music?: DB.OngekiStaticMusic;
};

export const OngekiTechEventRoutes = new Hono()
	/**
	 * Get the set of all tech events.
	 * Return them with their owner.
	 */
	.get("", async (c) => {
		try {
			const results = await db.select<TechEvent>(
				`
                    SELECT 
                        ose.*,
                        au.id AS ownerUserId,
                        au.username AS ownerUsername
                    FROM ongeki_static_events ose
                    JOIN daphnis_user_option duo ON
                        duo.key = ${DaphnisUserOptionKey.OngekiStaticEventOwner} AND
                        duo.value = ose.eventId
                    JOIN aime_user au ON
                        au.id = duo.user
                    WHERE ose.type = 17
                      AND ose.version = 7
                `
			);
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get tech events", error);
		}
	})
	.get("/:eventId", async (c) => {
		try {
			const { eventId } = c.req.param();
			const [event] = await db.select<TechEvent>(
				`
					SELECT 
						ose.*,
						au.id AS ownerUserId,
						au.username AS ownerUsername
					FROM ongeki_static_events ose
					LEFT JOIN daphnis_user_option duo ON
						duo.key = ${DaphnisUserOptionKey.OngekiStaticEventOwner} AND
						duo.value = ose.eventId
					LEFT JOIN aime_user au ON
						au.id = duo.user
					WHERE ose.eventId = ?
					  AND ose.type = 17
					  AND ose.version = 7
				`,
				[eventId]
			);
			const [music] = await db.select<DB.OngekiStaticTechMusic>(
				`
					SELECT 
						*
					FROM ongeki_static_tech_music
					WHERE eventId = ?
				`,
				[eventId]
			);
			return c.json({ ...event, music });
		} catch (error) {
			throw rethrowWithMessage("Failed to get tech event", error);
		}
	})

	/**
	 * Claim an event as the owner.
	 */
	.patch("/:eventId/claim", validateQuery(z.string().refine((x) => x.length > 0)), async (c) => {
		try {
			await db.inTransaction(async (conn) => {
				const userId = c.payload.userId;
				const { eventId } = c.req.param();

				// Make sure it's an actual event
				const [event] = await conn.select<number>(
					`
                        SELECT id
                        FROM ongeki_static_events 
                        WHERE eventId = ?
                          AND type = 17
                          AND version = 7
                    `,
					[eventId]
				);
				if (!event) {
					throw new Error("Event not found");
				}

				// Find existing owner
				const [existingOwner] = await conn.select<number>(
					`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE key = ${DaphnisUserOptionKey.OngekiStaticEventOwner}
                          AND value = ?
                    `,
					[eventId]
				);
				if (existingOwner) {
					throw new Error("Event already claimed");
				}

				// Claim event
				await conn.query(
					`
                        INSERT INTO daphnis_user_option (user, key, value)
                        VALUES (?, ${DaphnisUserOptionKey.OngekiStaticEventOwner}, ?)
                    `,
					[userId, eventId]
				);
			});
		} catch (error) {
			throw rethrowWithMessage("Failed to claim event", error);
		}
	})
	/**
	 * Unclaim an event as the owner.
	 */
	.patch("/:eventId/unclaim", validateQuery(z.string().refine((x) => x.length > 0)), async (c) => {
		try {
			await db.inTransaction(async (conn) => {
				const userId = c.payload.userId;
				const { eventId } = c.req.param();

				// Make sure it's an actual event
				const [event] = await conn.select<number>(
					`
                        SELECT id
                        FROM ongeki_static_events 
                        WHERE eventId = ?
                          AND type = 17
                          AND version = 7
                    `,
					[eventId]
				);
				if (!event) {
					throw new Error("Event not found");
				}

				// Find existing owner
				const [existingOwner] = await conn.select<number>(
					`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE key = ${DaphnisUserOptionKey.OngekiStaticEventOwner}
                          AND value = ?
                    `,
					[eventId]
				);
				if (existingOwner !== userId) {
					throw new Error("Event not claimed by you, fool");
				}

				// Unclaim event
				await conn.query(
					`
                        DELETE FROM daphnis_user_option
                        WHERE user = ?
                          AND key = ${DaphnisUserOptionKey.OngekiStaticEventOwner}
                          AND value = ?
                    `,
					[userId, eventId]
				);
			});
			c.newResponse(null, 204);
		} catch (error) {
			throw rethrowWithMessage("Failed to unclaim event", error);
		}
	})
	/**
	 * Add song to event.
	 */
	.post(
		"/:eventId",
		validateJson(
			z.object({
				songId: z.string().refine((x) => x.length > 0),
				level: z.number().int().min(0),
			})
		),
		async (c) => {
			const userId = c.payload.userId;
			const { eventId } = c.req.param();
			const { songId, level } = await c.req.json();

			try {
				await db.inTransaction(async (conn) => {
					// Make sure it's an actual event
					const [event] = await conn.select<number>(
						`
                            SELECT id
                            FROM ongeki_static_events 
                            WHERE eventId = ?
                              AND type = 17
                              AND version = 7
                        `,
						[eventId]
					);
					if (!event) {
						throw new Error("Event not found");
					}

					// Find existing owner
					const [existingOwner] = await conn.select<number>(
						`
                            SELECT user 
                            FROM daphnis_user_option
                            WHERE key = ${DaphnisUserOptionKey.OngekiStaticEventOwner}
                              AND value = ?
                        `,
						[eventId]
					);
					if (existingOwner !== userId) {
						throw new Error("Event not claimed by you, fool");
					}

					// Check that song is valid
					const [song] = await conn.select<DB.OngekiStaticMusic>(
						`
                            SELECT *
                            FROM static_ongeki_music
                            WHERE songId = ?
                              AND level = ?
                        `,
						[songId, level]
					);
					if (!song) {
						throw new Error("Invalid song");
					}

					// Check if song is already in event
					const [existingSong] = await conn.select<number>(
						`
                            SELECT id
                            FROM ongeki_event_songs
                            WHERE eventId = ?
                              AND songId = ?
                              AND level = ?
                        `,
						[eventId, songId, level]
					);
					if (existingSong) {
						throw new Error("Song already in event");
					}

					// Add song to event
					await conn.query(
						`
                            INSERT INTO ongeki_static_tech_music (version, eventId, musicId, level)
                            values (7, ?, ?, ?)
                        `,
						[eventId, songId, level]
					);
				});
			} catch (error) {
				throw rethrowWithMessage("Failed to add song to event", error);
			}
		}
	)
	/**
	 * Remove song from event.
	 */
	.delete(
		"/:eventId",
		validateJson(
			z.object({
				songId: z.string().refine((x) => x.length > 0),
				level: z.number().int().min(0),
			})
		),
		async (c) => {
			const userId = c.payload.userId;
			const { eventId } = c.req.param();
			const { songId, level } = await c.req.json();

			try {
				await db.inTransaction(async (conn) => {
					// Make sure it's an actual event
					const [event] = await conn.select<number>(
						`
                        SELECT id
                        FROM ongeki_static_events 
                        WHERE eventId = ?
                          AND type = 17
                          AND version = 7
                    `,
						[eventId]
					);
					if (!event) {
						throw new Error("Event not found");
					}

					// Find existing owner
					const [existingOwner] = await conn.select<number>(
						`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE key = ${DaphnisUserOptionKey.OngekiStaticEventOwner}
                          AND value = ?
                    `,
						[eventId]
					);
					if (existingOwner !== userId) {
						throw new Error("Event not claimed by you, fool");
					}

					// Check if song is already in event
					const [existingSong] = await conn.select<number>(
						`
                        SELECT id
                        FROM ongeki_event_songs
                        WHERE eventId = ?
                          AND songId = ?
                          AND level = ?
                    `,
						[eventId, songId, level]
					);
					if (!existingSong) {
						throw new Error("Song not in event");
					}

					// Remove song from event
					await conn.query(
						`
                        DELETE FROM ongeki_static_tech_music
                        WHERE eventId = ?
                          AND musicId = ?
                          AND level = ?
                    `,
						[eventId, songId, level]
					);
				});
			} catch (error) {
				throw rethrowWithMessage("Failed to add song to event", error);
			}
		}
	);
