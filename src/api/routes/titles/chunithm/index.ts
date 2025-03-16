import { Hono } from "hono";

import { AvatarRoutes } from "./avatar";
import { ChunithmRoutes } from "./chunithm";
import { FavoritesRoutes } from "./favorites";
import { ChunithmKamaitachiRoutes } from "./kamaitachi";
import { ChunithmLeaderboardRoutes } from "./leaderboard";
import { MapIconRoutes } from "./mapicon";
import { NameplateRoutes } from "./nameplate";
import { UserRatingFramesRoutes } from "./rating";
import { ChunithmReiwaRoutes } from "./reiwa";
import { RivalsRoutes } from "./rivals";
import { ChunithmSettingsRoutes } from "./settings";
import { SystemvoiceRoutes } from "./systemvoice";
import { TrophyRoutes } from "./trophies";

export const AllChunithmRoutes = new Hono()
	.route("", ChunithmRoutes)
	.route("/avatar", AvatarRoutes)
	.route("/favorites", FavoritesRoutes)
	.route("/kamaitachi", ChunithmKamaitachiRoutes)
	.route("/leaderboard", ChunithmLeaderboardRoutes)
	.route("/mapicon", MapIconRoutes)
	.route("/nameplates", NameplateRoutes)
	.route("", UserRatingFramesRoutes)
	.route("/reiwa", ChunithmReiwaRoutes)
	.route("/rivals", RivalsRoutes)
	.route("/settings", ChunithmSettingsRoutes)
	.route("/systemvoice", SystemvoiceRoutes)
	.route("/trophies", TrophyRoutes);
