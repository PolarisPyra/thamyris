import { Hono } from "hono";

import { AdminRoutes } from "./admin/admin";
import { AimeCardRoute } from "./common/aime";
import { UserRoutes } from "./common/users";
import { AllChunithmRoutes } from "./titles/chunithm";
import { OngekiLeaderboadRoutes } from "./titles/ongeki/leaderboard";
import { OngekiRoutes } from "./titles/ongeki/ongeki";
import { OngekiRatingRoutes } from "./titles/ongeki/rating";
import { OngekiReiwaRoutes } from "./titles/ongeki/reiwa";
import { OngekiRivalsRoutes } from "./titles/ongeki/rivals";
import { OngekiSettingsRoutes } from "./titles/ongeki/settings";
import { OngekiUnlockRoutes } from "./titles/ongeki/unlocks";
import { UnprotectedRoutes } from "./unprotected";

const Routes = new Hono()
	.route("/admin", AdminRoutes)
	.route("/aime", AimeCardRoute)
	.route("/users", UserRoutes)

	// Titles
	.route("/chunithm", AllChunithmRoutes)

	.route("/ongeki", OngekiRoutes)
	.route("/ongeki", OngekiRatingRoutes)
	.route("/ongeki", OngekiSettingsRoutes)
	.route("/ongeki", OngekiLeaderboadRoutes)
	.route("/ongeki", OngekiRivalsRoutes)
	.route("/ongeki", OngekiUnlockRoutes)
	.route("/ongeki", OngekiReiwaRoutes);

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
