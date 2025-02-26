import { hc } from "hono/client";
import { ApiRouteType } from "@/api/routes";

export const api = hc<ApiRouteType>("/api");
