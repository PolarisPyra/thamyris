import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotenv } from "dotenv";

dotenv();

export const config = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "production"]).default("development"),
		JWT_SECRET: z.string(),
		DOMAIN: z.string(),
		RATELIMIT_KEY: z.string(),
		PORT: z.coerce.number().default(3000),
		SERVER_PORT: z.coerce.number().default(3000),

		// Development database
		DEV_MYSQL_HOST: z.string().optional(),
		DEV_MYSQL_USERNAME: z.string().optional(),
		DEV_MYSQL_PASSWORD: z.string().optional(),
		DEV_MYSQL_DATABASE: z.string().optional(),

		// Production database
		PROD_MYSQL_HOST: z.string().optional(),
		PROD_MYSQL_USERNAME: z.string().optional(),
		PROD_MYSQL_PASSWORD: z.string().optional(),
		PROD_MYSQL_DATABASE: z.string().optional(),
	},
	runtimeEnv: process.env,
});
