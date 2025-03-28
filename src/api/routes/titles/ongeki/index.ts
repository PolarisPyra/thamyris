import { Hono } from "hono";

import { OngekiLeaderboardRoutes } from "./leaderboard";
import { OngekiModsRoutes } from "./modifications";
import { NewUserRatingFramesRoutes } from "./new-rating";
import { OngekiRoutes } from "./ongeki";
import { OngekiRatingRoutes } from "./rating";
import { OngekiReiwaRoutes } from "./reiwa";
import { OngekiRivalsRoutes } from "./rivals";
import { OngekiSettingsRoutes } from "./settings";

export const AllOngekiRoutes = new Hono()
	.route("", OngekiRoutes)
	.route("rating", OngekiRatingRoutes)
	.route("newRating", NewUserRatingFramesRoutes)
	.route("settings", OngekiSettingsRoutes)
	.route("leaderboard", OngekiLeaderboardRoutes)

	.route("rivals", OngekiRivalsRoutes)
	.route("mods", OngekiModsRoutes)
	.route("reiwa", OngekiReiwaRoutes);
