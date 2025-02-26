import { hc } from "hono/client";

import { ApiRouteType } from "@/api";

export const api = hc<ApiRouteType>("/api");
