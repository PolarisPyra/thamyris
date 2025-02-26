import { ApiRouteType } from "@/api";
import { hc } from "hono/client";

export const api = hc<ApiRouteType>("/api");
