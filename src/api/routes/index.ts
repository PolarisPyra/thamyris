import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { aimeCardRoute } from "./common/aime";
import { userRoutes } from "./common/users";
import { AvatarRoutes } from "./titles/chunithm/avatar";
import { ChunithmRoutes } from "./titles/chunithm/chunithm";
import { favoritesRoutes } from "./titles/chunithm/favorites";
import { mapIconRoutes } from "./titles/chunithm/mapicon";
import { nameplateRoutes } from "./titles/chunithm/nameplate";
import { UserRatingFramesRoutes } from "./titles/chunithm/rating";
import { rivalsRoutes } from "./titles/chunithm/rivals";
import { chunithmSettingsRoute } from "./titles/chunithm/settings";
import { systemvoiceRoutes } from "./titles/chunithm/systemvoice";
import { OngekiRoutes } from "./titles/ongeki/ongeki";
import { OngekiRatingRoutes } from "./titles/ongeki/rating";
import { ongekiSettingsRoute } from "./titles/ongeki/settings";
import { unprotectedRoutes } from "./unprotected";

const routes = new Hono()
	.route("/aime", aimeCardRoute)
	.route("/chunithm", ChunithmRoutes)
	.route("/chunithm", AvatarRoutes)
	.route("/users", userRoutes)
	.route("/chunithm", nameplateRoutes)
	.route("/chunithm", systemvoiceRoutes)
	.route("/chunithm", favoritesRoutes)
	.route("/chunithm", rivalsRoutes)
	.route("/chunithm", mapIconRoutes)
	.route("/chunithm", chunithmSettingsRoute)
	.route("/chunithm", UserRatingFramesRoutes)
	.route("/ongeki", OngekiRoutes)
	.route("/ongeki", OngekiRatingRoutes)
	.route("/ongeki", ongekiSettingsRoute)
	.route("/admin", AdminRoutes);

export { routes, unprotectedRoutes };

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

export type ApiRouteType = typeof routes | typeof unprotectedRoutes;
