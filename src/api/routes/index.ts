import { Hono } from "hono";
import { aimeCardRoute } from "./common/aime";
import { userRoutes } from "./common/users";
import openRoutes from "./open";
import { AvatarRoutes } from "./titles/chunithm/avatar";
import { ChunithmRoutes } from "./titles/chunithm/chunithm";
import { nameplateRoutes } from "./titles/chunithm/nameplate";
import { systemvoiceRoutes } from "./titles/chunithm/systemvoice";
import { favoritesRoutes } from "./titles/chunithm/favorites";
import { rivalsRoutes } from "./titles/chunithm/rivals";
import { mapIconRoutes } from "./titles/chunithm/mapicon";
import { chunithmSettingsRoute } from "./titles/chunithm/settings";
import { UserRatingFramesRoutes } from "./titles/chunithm/rating";
import { OngekiRoutes } from "./titles/ongeki/ongeki";
import { OngekiRatingRoutes } from "./titles/ongeki/rating";
import { ongekiSettingsRoute } from "./titles/ongeki/settings";
import { AdminRoutes } from "./admin/admin";

const authRoutes = new Hono()
	.route("/aime", aimeCardRoute)
	.route("/chunithm", ChunithmRoutes)
	.route("/chunithm", AvatarRoutes)
	.route("/users", userRoutes)
	.route("/chunithm", nameplateRoutes)
	.route("/chunithm", systemvoiceRoutes)
	.route("/chunithm", favoritesRoutes)
	.route("/chunithm", rivalsRoutes)
	.route("/chunithm", mapIconRoutes)
	.route("/chunithm", chunithmSettingsRoute)
	.route("/chunithm", UserRatingFramesRoutes)
	.route("/ongeki", OngekiRoutes)
	.route("/ongeki", OngekiRatingRoutes)
	.route("/ongeki", ongekiSettingsRoute)
	.route("/admin", AdminRoutes);

export { authRoutes, openRoutes };
export type ApiRouteType = typeof authRoutes | typeof openRoutes;
