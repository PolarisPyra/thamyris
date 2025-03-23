import { Hono } from "hono";

import { AimeCardRoute } from "./aime";
import { ArcadeRoutes } from "./arcades";
import { UserRoutes } from "./users";

export const AllCommonRoutes = new Hono()

	.route("arcades", ArcadeRoutes)
	.route("users", UserRoutes)
	.route("aime", AimeCardRoute);
