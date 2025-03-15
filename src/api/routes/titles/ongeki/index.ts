import { Hono } from "hono";

import { OngekiLeaderboadRoutes } from "./leaderboard";
import { OngekiRoutes } from "./ongeki";
import { OngekiRatingRoutes } from "./rating";
import { OngekiReiwaRoutes } from "./reiwa";
import { OngekiRivalsRoutes } from "./rivals";
import { OngekiSettingsRoutes } from "./settings";
import { OngekiTechEventRoutes } from "./techevent";
import { OngekiUnlockRoutes } from "./unlocks";

export const AllOngekiRoutes = new Hono()
	.basePath("/ongeki")
	.route("", OngekiRoutes)
	.route("/leaderboard", OngekiLeaderboadRoutes)
	.route("/rating", OngekiRatingRoutes)
	.route("/reiwa", OngekiReiwaRoutes)
	.route("/rivals", OngekiRivalsRoutes)
	.route("/settings", OngekiSettingsRoutes)
	.route("/techevent", OngekiTechEventRoutes)
	.route("/unlock", OngekiUnlockRoutes);
