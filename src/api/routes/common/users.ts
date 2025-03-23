import { Hono } from "hono";

const UserRoutes = new Hono().post("/verify", async (c) => {
	// The JWT middleware will have already verified the token
	// and added the payload to the context
	return c.json(c.payload);
});

export { UserRoutes };
