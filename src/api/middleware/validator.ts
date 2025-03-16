import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

// Directly throws an error if the input is invalid
// https://github.com/honojs/middleware/blob/main/packages/zod-validator/README.md
export const validate = <T extends ZodSchema, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
	zv(target, schema, (result, _) => {
		if (!result.success) {
			throw result.error;
		}
	});

export const validateJson = <T extends ZodSchema>(schema: T) => validate("json", schema);
export const validateQuery = <T extends ZodSchema>(schema: T) => validate("query", schema);
export const validateParams = <T extends ZodSchema>(schema: T) => validate("param", schema);
