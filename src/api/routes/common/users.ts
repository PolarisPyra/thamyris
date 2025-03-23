import { Hono } from "hono";

const UserRoutes = new Hono()
	.post("/verify", async (c) => {
		// The JWT middleware will have already verified the token
		// and added the payload to the context
		return c.json(c.payload);
	})

	.get("/buildinfo", (c) => {
		return c.json({
			buildDate: env.BUILD_DATE_YEAR_MONTH_DAY,
			buildTime: env.BUILD_TIME_12_HOUR,
			buildHash: env.BUILD_HASH,
		});
	});

export { UserRoutes };
