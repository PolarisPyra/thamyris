import mysql from "mysql";
import util from "util";
import { aimeCardRoute } from "./routes/common/aime";
import { ChunithmRoutes } from "./routes/titles/chunithm/chunithm";
import { Hono } from "hono";
import { AvatarRoutes } from "./routes/titles/chunithm/avatar";
import { userRoutes } from "./routes/common/users";
import { nameplateRoutes } from "./routes/titles/chunithm/nameplate";
import { OngekiRoutes } from "./routes/titles/ongeki/ongeki";
import { mapIconRoutes } from "./routes/titles/chunithm/mapicon";
import { systemvoiceRoutes } from "./routes/titles/chunithm/systemvoice";
import { favoritesRoutes } from "./routes/titles/chunithm/favorites";
import { rivalsRoutes } from "./routes/titles/chunithm/rivals";
import { chunithmSettingsRoute } from "./routes/titles/chunithm/settings";
import { env } from "@/env";
import { routeLogger } from "./middleware/logs";
import { UserRatingFramesRoutes } from "./routes/titles/chunithm/userRatingFrames";
import { OngekiRatingRoutes } from "./routes/titles/ongeki/rating";
import { ongekiSettingsRoute } from "./routes/titles/ongeki/settings";
interface Databaseenv {
	host: string;
	user: string;
	password: string;
	database: string;
}

const getDatabaseenv = (): Databaseenv => {
	const isProduction = env.NODE_ENV === "production";

	let dbenv: Databaseenv;

	if (isProduction) {
		if (
			!env.PROD_MYSQL_HOST ||
			!env.PROD_MYSQL_USERNAME ||
			!env.PROD_MYSQL_PASSWORD ||
			!env.PROD_MYSQL_DATABASE
		) {
			throw new Error("Missing required production database envuration");
		}
		dbenv = {
			host: env.PROD_MYSQL_HOST,
			user: env.PROD_MYSQL_USERNAME,
			password: env.PROD_MYSQL_PASSWORD,
			database: env.PROD_MYSQL_DATABASE,
		};
	} else {
		if (
			!env.DEV_MYSQL_HOST ||
			!env.DEV_MYSQL_USERNAME ||
			!env.DEV_MYSQL_PASSWORD ||
			!env.DEV_MYSQL_DATABASE
		) {
			throw new Error("Missing required development database envuration");
		}
		dbenv = {
			host: env.DEV_MYSQL_HOST,
			user: env.DEV_MYSQL_USERNAME,
			password: env.DEV_MYSQL_PASSWORD,
			database: env.DEV_MYSQL_DATABASE,
		};
	}

	return dbenv;
};

class Database {
	private static instance: Database;
	private connection: mysql.Connection;
	public query: (sql: string, values?: any) => Promise<any>;

	private constructor(env: Databaseenv) {
		// Initialize connection first
		this.connection = mysql.createConnection(env);
		// Initialize the promisified query
		this.query = util.promisify(this.connection.query).bind(this.connection);
		// Setup connection handlers after initialization
		this.setupConnectionHandlers();
	}

	private setupConnectionHandlers() {
		this.connection.connect((err) => {
			if (err) {
				console.error("Error connecting to database:", err);
				return;
			}
			console.log("Connected to database");
		});

		this.connection.on("error", (err) => {
			console.error("Database error:", err);
			if (err.code === "PROTOCOL_CONNECTION_LOST") {
				this.connection.connect();
			} else {
				throw err;
			}
		});
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			const env = getDatabaseenv();
			Database.instance = new Database(env);
		}
		return Database.instance;
	}
}

const routes = new Hono()

	.use("*", routeLogger)
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
	.route("/ongeki", ongekiSettingsRoute);

export { routes };

export type ApiRouteType = typeof routes;

export const db = Database.getInstance();
