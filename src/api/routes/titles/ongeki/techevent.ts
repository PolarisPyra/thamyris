import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import db, { Connection } from "@/api/db";
import { validateJson, validateParams } from "@/api/middleware/validator";
import { DB } from "@/api/types";
import { DaphnisUserOptionKey } from "@/api/types/db";
import { rethrowWithMessage } from "@/api/utils/error";

type MusicID = {
	id: number;
	level: number;
};

type TechEvent = DB.OngekiStaticEvents & {
	eventId: number;

	ownerUserId: string | null;
	ownerUsername: string | null;
	musicIds: MusicID[];
};

const imLazy = async (conn?: Connection): Promise<TechEvent[]> => {
	const results = await (conn || db).select<TechEvent & { musicId: number; level: number }>(
		`
			SELECT 
				ose.*,
				au.id AS ownerUserId,
				au.username AS ownerUsername,
				osm.musicId,
				osm.level
			FROM ongeki_static_events ose
			LEFT JOIN ongeki_static_tech_music osm ON
				osm.eventId = ose.eventId
			LEFT JOIN daphnis_user_option duo ON
				duo.key = '${DaphnisUserOptionKey.OngekiTechEventOwner}' AND
				duo.value = ose.eventId
			LEFT JOIN aime_user au ON
				au.id = duo.user
			WHERE ose.eventId IS NOT NULL
			  AND ose.type = 17
			  AND ose.version = 7
			ORDER BY ose.eventId, osm.musicId
		`
	);

	const events: TechEvent[] = [];
	for (const r of results) {
		let event: any = events.find((e) => e.eventId === r.eventId);
		if (!event) {
			event = { ...r, musicIds: [] };
			delete event.musicId;
			delete event.level;
			event.name = event.name.replace("テクニカルチャレンジ：", "");
			events.push(event);
		}
		if (r.musicId && r.level !== null) {
			event.musicIds.push({ id: r.musicId, level: r.level });
		}
	}
	return events;
};

export const OngekiTechEventRoutes = new Hono()
	/**
	 * Get the set of all tech events.
	 * Return them with their owner and song ids
	 */
	.get("", async (c) => {
		try {
			const results = await imLazy();
			return c.json(results);
		} catch (error) {
			throw rethrowWithMessage("Failed to get tech events", error);
		}
	})
	.get(
		"/:eventId",
		validateParams(
			z.object({
				eventId: z
					.string()
					.transform((x) => parseInt(x))
					.pipe(z.number()),
			})
		),
		async (c) => {
			try {
				const eventId = parseInt(c.req.param().eventId);
				const results = await imLazy();
				const event = results.find((e) => e.eventId === eventId);
				if (!event) {
					throw new HTTPException(404);
				}
				return c.json(event);
			} catch (error) {
				throw rethrowWithMessage("Failed to get tech event", error);
			}
		}
	)

	/**
	 * Claim an event as the owner.
	 */
	.patch(
		"/:eventId/claim",
		validateParams(
			z.object({
				eventId: z
					.string()
					.transform((x) => parseInt(x))
					.pipe(z.number()),
			})
		),
		async (c) => {
			try {
				await db.inTransaction(async (conn) => {
					const userId = c.payload.userId;
					const eventId = parseInt(c.req.param().eventId);

					// Make sure it's an actual event
					const [event] = await conn.select<{ id: number }>(
						`
							SELECT id
							FROM ongeki_static_events 
							WHERE eventId = ?
							AND type = 17
							AND version = 7
                    	`,
						[eventId]
					);

					if (!event?.id) {
						throw new HTTPException(404);
					}

					// Find existing owner
					const [existingOwner] = await conn.select<{ user: number }>(
						`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
                          AND value = ?
                    `,
						[eventId]
					);
					if (existingOwner?.user) {
						throw new HTTPException(400);
					}

					const [existingOwnedEvent] = await conn.select<{ value: number }>(
						`
						SELECT value
						FROM daphnis_user_option
						WHERE \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
						  AND user = ?
					`,
						[userId]
					);
					if (existingOwnedEvent?.value) {
						throw new HTTPException(400);
					}

					// Claim event
					await conn.query(
						`
							INSERT INTO daphnis_user_option (user, \`key\`, value)
							VALUES (?, '${DaphnisUserOptionKey.OngekiTechEventOwner}', ?)
                    	`,
						[userId, eventId]
					);
				});

				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to claim event", error);
			}
		}
	)
	/**
	 * Unclaim an event as the owner.
	 */
	.patch(
		"/:eventId/unclaim",
		validateParams(
			z.object({
				eventId: z
					.string()
					.refine((x) => x.length > 0)
					.transform((x) => parseInt(x)),
			})
		),
		async (c) => {
			try {
				await db.inTransaction(async (conn) => {
					const userId = c.payload.userId;
					const { eventId } = c.req.param();

					// Make sure it's an actual event
					const [event] = await conn.select<{ id: number }>(
						`
                        SELECT id
                        FROM ongeki_static_events 
                        WHERE eventId = ?
                          AND type = 17
                          AND version = 7
                    `,
						[eventId]
					);
					if (!event?.id) {
						throw new HTTPException(404);
					}

					// Find existing owner
					const [existingOwner] = await conn.select<{ user: number }>(
						`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
                          AND value = ?
                    `,
						[eventId]
					);
					if (existingOwner?.user !== userId) {
						throw new HTTPException(400);
					}

					// Unclaim event
					await conn.query(
						`
                        DELETE FROM daphnis_user_option
                        WHERE user = ?
                          AND \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
                          AND value = ?
                    `,
						[userId, eventId]
					);
				});

				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to unclaim event", error);
			}
		}
	)
	/**
	 * Add song to event.
	 */
	.post(
		"/:eventId",
		validateJson(
			z.object({
				musicId: z.number().int().min(0),
				level: z.number().min(0),
			})
		),
		async (c) => {
			const userId = c.payload.userId;
			const { eventId } = c.req.param();
			const { musicId, level } = await c.req.json();
			try {
				await db.inTransaction(async (conn) => {
					// Make sure it's an actual event
					const [event] = await conn.select<{ id: number }>(
						`
                            SELECT id
                            FROM ongeki_static_events 
                            WHERE eventId = ?
                              AND type = 17
                              AND version = 7
                        `,
						[eventId]
					);
					if (!event?.id) {
						throw new HTTPException(404);
					}

					// Find existing owner
					const [existingOwner] = await conn.select<{ user: number }>(
						`
                            SELECT user 
                            FROM daphnis_user_option
                            WHERE \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
                              AND value = ?
                        `,
						[eventId]
					);
					if (existingOwner?.user !== userId) {
						throw new HTTPException(400);
					}

					// Check that song is valid
					const [song] = await conn.select<DB.OngekiStaticMusic>(
						`
                            SELECT *
                            FROM ongeki_static_music
                            WHERE songId = ?
                              AND ROUND(level, 1) = ?
                        `,
						[musicId, level]
					);
					if (!song) {
						throw new HTTPException(404);
					}

					// Check if song is already in event
					const [existingSong] = await conn.select<number>(
						`
                            SELECT id
                            FROM ongeki_static_tech_music
                            WHERE eventId = ?
                              AND musicId = ?
                              AND ROUND(level, 1) = ?
                        `,
						[eventId, musicId, level]
					);
					if (existingSong) {
						throw new HTTPException(400);
					}

					// Add song to event
					await conn.query(
						`
                            INSERT INTO ongeki_static_tech_music (version, eventId, musicId, level)
                            values (7, ?, ?, ?)
                        `,
						[eventId, musicId, level]
					);
				});
				return new Response();
			} catch (error) {
				console.error(error);
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
				musicId: z.number().int().min(0),
				level: z.number().min(0),
			})
		),
		async (c) => {
			const userId = c.payload.userId;
			const { eventId } = c.req.param();
			const { songId, level } = await c.req.json();

			try {
				await db.inTransaction(async (conn) => {
					// Make sure it's an actual event
					const [event] = await conn.select<{ id: number }>(
						`
                        SELECT id
                        FROM ongeki_static_events 
                        WHERE eventId = ?
                          AND type = 17
                          AND version = 7
                    `,
						[eventId]
					);
					if (!event?.id) {
						throw new HTTPException(404);
					}

					// Find existing owner
					const [existingOwner] = await conn.select<{ user: number }>(
						`
                        SELECT user 
                        FROM daphnis_user_option
                        WHERE \`key\` = '${DaphnisUserOptionKey.OngekiTechEventOwner}'
                          AND value = ?
                    `,
						[eventId]
					);
					if (existingOwner?.user !== userId) {
						throw new HTTPException(400);
					}

					// Check if song is in the event
					const [existingSong] = await conn.select<{ id: number }>(
						`
                        SELECT id
                        FROM ongeki_static_tech_music
                        WHERE eventId = ?
                          AND musicId = ?
                          AND ROUND(level, 1) = ?
                    `,
						[eventId, songId, level]
					);
					if (!existingSong) {
						throw new HTTPException(400);
					}

					// Remove song from event
					await conn.query(
						`
                        DELETE FROM ongeki_static_tech_music
                        WHERE eventId = ?
                          AND musicId = ?
                          AND ROUND(level, 1) = ?
                    `,
						[eventId, songId, level]
					);
				});
				return new Response();
			} catch (error) {
				throw rethrowWithMessage("Failed to add song to event", error);
			}
		}
	);
