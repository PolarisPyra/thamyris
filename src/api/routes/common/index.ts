import { Hono } from "hono";

import { ArcadeRoutes } from "./arcades";

export const AllChunithmRoutes = new Hono().route("arcades", ArcadeRoutes);
