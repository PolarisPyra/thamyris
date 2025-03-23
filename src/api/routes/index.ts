import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AllCommonRoutes } from "./common";
import { AimeCardRoute } from "./common/aime";
import { ArcadeRoutes } from "./common/arcades";
import { UserRoutes } from "./common/users";
import { AllChunithmRoutes } from "./titles/chunithm";
import { AllMaimaiRoutes } from "./titles/maimai";
import { AllOngekiRoutes } from "./titles/ongeki";
import { UnprotectedRoutes } from "./unprotected";

const Routes = new Hono()
	.route("/admin", AdminRoutes)
	.route("/aime", AimeCardRoute)
	.route("/users", UserRoutes)
	.route("/common", AllCommonRoutes)

	// Titles
	.route("/chunithm", AllChunithmRoutes)
	.route("/ongeki", AllOngekiRoutes)
	.route("/maimai", AllMaimaiRoutes)
	.route("/arcades", ArcadeRoutes);

export { Routes, UnprotectedRoutes };

/**
 *
 *
 * The routes are grouped by:
 * - Aime card functionality
 * - Chunithm game endpoints
 * - User management
 * - Ongeki game endpoints
 * - Admin functionality
 * These routes are also protected
 *
 */

export type ApiRouteType = typeof Routes | typeof UnprotectedRoutes;
