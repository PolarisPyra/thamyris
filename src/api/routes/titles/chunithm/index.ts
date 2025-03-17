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
import { SystemVoiceRoutes } from "./systemvoice";
import { TrophyRoutes } from "./trophies";

export const AllChunithmRoutes = new Hono()
	.route("", ChunithmRoutes)
	.route("avatar", AvatarRoutes)
	.route("favorites", FavoritesRoutes)
	.route("kamaitachi", ChunithmKamaitachiRoutes)
	.route("leaderboard", ChunithmLeaderboardRoutes)
	.route("mapicon", MapIconRoutes)
	.route("nameplate", NameplateRoutes)
	.route("rating", UserRatingFramesRoutes)
	.route("reiwa", ChunithmReiwaRoutes)
	.route("rivals", RivalsRoutes)
	.route("settings", ChunithmSettingsRoutes)
	.route("systemvoice", SystemVoiceRoutes)
	.route("trophy", TrophyRoutes);
