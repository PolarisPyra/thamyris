import { Hono } from "hono";

import { MaimaiRoutes } from "./maimai";

export const AllMaimaiRoutes = new Hono().route("", MaimaiRoutes);
