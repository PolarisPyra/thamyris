import { Hono } from "hono";

import { OngekiLeaderboardRoutes } from "./leaderboard";
import { OngekiUnlockRoutes } from "./modifications";
import { OngekiRoutes } from "./ongeki";
import { OngekiRatingRoutes } from "./rating";
import { OngekiReiwaRoutes } from "./reiwa";
import { OngekiRivalsRoutes } from "./rivals";
import { OngekiSettingsRoutes } from "./settings";

export const AllOngekiRoutes = new Hono()
	.route("", OngekiRoutes)
	.route("rating", OngekiRatingRoutes)
	.route("settings", OngekiSettingsRoutes)
	.route("leaderboard", OngekiLeaderboardRoutes)
	.route("rivals", OngekiRivalsRoutes)
	.route("unlocks", OngekiUnlockRoutes)
	.route("reiwa", OngekiReiwaRoutes);
