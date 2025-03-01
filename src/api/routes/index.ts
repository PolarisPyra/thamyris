import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AimeCardRoute } from "./common/aime";
import { UserRoutes } from "./common/users";
import { AvatarRoutes } from "./titles/chunithm/avatar";
import { ChunithmRoutes } from "./titles/chunithm/chunithm";
import { FavoritesRoutes } from "./titles/chunithm/favorites";
import { ChunithmLeaderboardRoutes } from "./titles/chunithm/leaderboard";
import { MapIconRoutes } from "./titles/chunithm/mapicon";
import { NameplateRoutes } from "./titles/chunithm/nameplate";
import { UserRatingFramesRoutes } from "./titles/chunithm/rating";
import { RivalsRoutes } from "./titles/chunithm/rivals";
import { ChunithmSettingsRoute } from "./titles/chunithm/settings";
import { SystemvoiceRoutes } from "./titles/chunithm/systemvoice";
import { OngekiLeaderboadRoutes } from "./titles/ongeki/leaderboard";
import { OngekiRoutes } from "./titles/ongeki/ongeki";
import { OngekiRatingRoutes } from "./titles/ongeki/rating";
import { OngekiSettingsRoutes } from "./titles/ongeki/settings";
import { unprotectedRoutes } from "./unprotected";

const routes = new Hono()
	.route("/aime", AimeCardRoute)
	.route("/chunithm", ChunithmRoutes)
	.route("/chunithm", AvatarRoutes)
	.route("/users", UserRoutes)
	.route("/chunithm", NameplateRoutes)
	.route("/chunithm", SystemvoiceRoutes)
	.route("/chunithm", FavoritesRoutes)
	.route("/chunithm", RivalsRoutes)
	.route("/chunithm", ChunithmLeaderboardRoutes)

	.route("/chunithm", MapIconRoutes)
	.route("/chunithm", ChunithmSettingsRoute)
	.route("/chunithm", UserRatingFramesRoutes)
	.route("/ongeki", OngekiRoutes)
	.route("/ongeki", OngekiRatingRoutes)
	.route("/ongeki", OngekiSettingsRoutes)
	.route("/ongeki", OngekiLeaderboadRoutes)

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
