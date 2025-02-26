import { Hono } from "hono";
import login from "./login";

const openRoutes = new Hono().route("/", login);

export default openRoutes;
