import { Hono } from "hono";
import { z } from "zod";

import db from "@/api/db";
import { validateJson } from "@/api/middleware/validator";
import { DaphnisUserOptionKey } from "@/api/types/db";
import { rethrowWithMessage } from "@/api/utils/error";

const ChunithmModsRoutes = new Hono()

	.post(
		"songs/unlock",
		validateJson(
			z.object({
				value: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId } = c.payload;
				const { value } = await c.req.json();

				const update = await db.query(
					`
					UPDATE daphnis_user_option 
             		SET value = ? 
             		WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.UnlockAllSongs}'
				`,
					[value, userId]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.post(
		"songs/lock",
		validateJson(
			z.object({
				value: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId } = c.payload;
				const { value } = await c.req.json();

				const update = await db.query(
					`
					UPDATE daphnis_user_option 
             		SET value = ? 
             		WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.UnlockAllSongs}'
				`,
					[value, userId]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.post(
		"tickets/unlimited",
		validateJson(
			z.object({
				value: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId } = c.payload;
				const { value } = await c.req.json();

				const update = await db.query(
					`
					UPDATE daphnis_user_option 
             		SET value = ? 
             		WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.MaxTickets}'
				`,
					[value, userId]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	)

	.post(
		"tickets/limited",
		validateJson(
			z.object({
				value: z.number(),
			})
		),
		async (c) => {
			try {
				const { userId } = c.payload;
				const { value } = await c.req.json();

				const update = await db.query(
					`
					UPDATE daphnis_user_option 
             		SET value = ? 
             		WHERE user = ? AND \`key\` = '${DaphnisUserOptionKey.MaxTickets}'
				`,
					[value, userId]
				);

				return c.json(update);
			} catch (error) {
				throw rethrowWithMessage("Failed to add favorite", error);
			}
		}
	);
export { ChunithmModsRoutes };
