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
	.route("", AvatarRoutes)
	.route("", FavoritesRoutes)
	.route("", ChunithmKamaitachiRoutes)
	.route("", ChunithmLeaderboardRoutes)
	.route("", MapIconRoutes)
	.route("", NameplateRoutes)
	.route("", UserRatingFramesRoutes)
	.route("", ChunithmReiwaRoutes)
	.route("", RivalsRoutes)
	.route("", ChunithmSettingsRoutes)
	.route("", SystemvoiceRoutes)
	.route("", TrophyRoutes);
