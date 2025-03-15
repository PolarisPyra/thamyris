import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AimeCardRoute } from "./common/aime";
import { UserRoutes } from "./common/users";
import { AllChunithmRoutes } from "./titles/chunithm";
import { AllOngekiRoutes } from "./titles/ongeki";
import { UnprotectedRoutes } from "./unprotected";

const Routes = new Hono()
	.route("/admin", AdminRoutes)
	.route("/aime", AimeCardRoute)
	.route("/users", UserRoutes)

	// Titles
	.route("/chunithm", AllChunithmRoutes)
	.route("/ongeki", AllOngekiRoutes);

export { Routes, UnprotectedRoutes };

export type ApiRouteType = typeof Routes | typeof UnprotectedRoutes;
