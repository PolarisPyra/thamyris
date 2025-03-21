import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AimeCardRoute } from "./common/aime";
import { UserRoutes } from "./common/users";
import { AllChunithmRoutes } from "./titles/chunithm";
import { AllMaimaiRoutes } from "./titles/maimai";
import { AllOngekiRoutes } from "./titles/ongeki";
import { UnprotectedRoutes } from "./unprotected";

const Routes = new Hono()
	.route("/admin", AdminRoutes)
	.route("/aime", AimeCardRoute)
	.route("/users", UserRoutes)

	// Titles
	.route("/chunithm", AllChunithmRoutes)
	.route("/ongeki", AllOngekiRoutes)
	.route("/maimai", AllMaimaiRoutes);

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
