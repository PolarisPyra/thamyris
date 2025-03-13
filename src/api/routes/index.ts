import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AimeCardRoute } from "./common/aime";
import { UserRoutes } from "./common/users";
import { AvatarRoutes } from "./titles/chunithm/avatar";
import { ChunithmRoutes } from "./titles/chunithm/chunithm";
import { FavoritesRoutes } from "./titles/chunithm/favorites";
import { ChunithmKamaitachiRoutes } from "./titles/chunithm/kamaitachi";
import { ChunithmLeaderboardRoutes } from "./titles/chunithm/leaderboard";
import { MapIconRoutes } from "./titles/chunithm/mapicon";
import { NameplateRoutes } from "./titles/chunithm/nameplate";
import { UserRatingFramesRoutes } from "./titles/chunithm/rating";
import { RivalsRoutes } from "./titles/chunithm/rivals";
import { ChunithmSettingsRoutes } from "./titles/chunithm/settings";
import { SystemvoiceRoutes } from "./titles/chunithm/systemvoice";
import TrophyRoutes from "./titles/chunithm/trophies";
import { ChunithmUnlockRoutes } from "./titles/chunithm/unlocks";
import { OngekiLeaderboadRoutes } from "./titles/ongeki/leaderboard";
import { OngekiRoutes } from "./titles/ongeki/ongeki";
import { OngekiRatingRoutes } from "./titles/ongeki/rating";
import { OngekiReiwaRoutes } from "./titles/ongeki/reiwa";
import { OngekiRivalsRoutes } from "./titles/ongeki/rivals";
import { OngekiSettingsRoutes } from "./titles/ongeki/settings";
import { OngekiUnlockRoutes } from "./titles/ongeki/unlocks";
import { UnprotectedRoutes } from "./unprotected";

const Routes = new Hono()

	.route("/aime", AimeCardRoute)
	.route("/users", UserRoutes)
	.route("/chunithm", ChunithmRoutes)
	.route("/chunithm", AvatarRoutes)
	.route("/chunithm", NameplateRoutes)
	.route("/chunithm", SystemvoiceRoutes)
	.route("/chunithm", FavoritesRoutes)
	.route("/chunithm", RivalsRoutes)
	.route("/chunithm", ChunithmLeaderboardRoutes)
	.route("/chunithm", ChunithmUnlockRoutes)
	.route("/chunithm", MapIconRoutes)
	.route("/chunithm", TrophyRoutes)
	.route("/chunithm", ChunithmSettingsRoutes)
	.route("/chunithm", UserRatingFramesRoutes)
	.route("/chunithm", ChunithmKamaitachiRoutes)
	.route("/ongeki", OngekiRoutes)
	.route("/ongeki", OngekiRatingRoutes)
	.route("/ongeki", OngekiSettingsRoutes)
	.route("/ongeki", OngekiLeaderboadRoutes)
	.route("/ongeki", OngekiRivalsRoutes)
	.route("/ongeki", OngekiUnlockRoutes)
	.route("/ongeki", OngekiReiwaRoutes)

	.route("/admin", AdminRoutes);

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
