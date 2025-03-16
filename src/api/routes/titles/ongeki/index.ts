import { Hono } from "hono";

import { OngekiLeaderboadRoutes } from "./leaderboard";
import { OngekiRoutes } from "./ongeki";
import { OngekiRatingRoutes } from "./rating";
import { OngekiReiwaRoutes } from "./reiwa";
import { OngekiRivalsRoutes } from "./rivals";
import { OngekiSettingsRoutes } from "./settings";
import { OngekiUnlockRoutes } from "./unlocks";

export const AllOngekiRoutes = new Hono()
	.route("", OngekiRoutes)
	.route("", OngekiRatingRoutes)
	.route("", OngekiSettingsRoutes)
	.route("", OngekiLeaderboadRoutes)
	.route("", OngekiRivalsRoutes)
	.route("", OngekiUnlockRoutes)
	.route("", OngekiReiwaRoutes);
