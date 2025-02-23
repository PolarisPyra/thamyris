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
import { ongekiSettingsRoute } from "./routes/titles/ongeki/settings";
import { config } from "@/env";
import { routeLogger } from "./middleware/logs";
import { UserRatingFramesRoutes } from "./routes/titles/chunithm/userRatingFrames";

interface DatabaseConfig {
	host: string;
	user: string;
	password: string;
	database: string;
}

const getDatabaseConfig = (): DatabaseConfig => {
	const isProduction = config.NODE_ENV === "production";

	let dbConfig: DatabaseConfig;

	if (isProduction) {
		if (
			!config.PROD_MYSQL_HOST ||
			!config.PROD_MYSQL_USERNAME ||
			!config.PROD_MYSQL_PASSWORD ||
			!config.PROD_MYSQL_DATABASE
		) {
			throw new Error("Missing required production database configuration");
		}
		dbConfig = {
			host: config.PROD_MYSQL_HOST,
			user: config.PROD_MYSQL_USERNAME,
			password: config.PROD_MYSQL_PASSWORD,
			database: config.PROD_MYSQL_DATABASE,
		};
	} else {
		if (
			!config.DEV_MYSQL_HOST ||
			!config.DEV_MYSQL_USERNAME ||
			!config.DEV_MYSQL_PASSWORD ||
			!config.DEV_MYSQL_DATABASE
		) {
			throw new Error("Missing required development database configuration");
		}
		dbConfig = {
			host: config.DEV_MYSQL_HOST,
			user: config.DEV_MYSQL_USERNAME,
			password: config.DEV_MYSQL_PASSWORD,
			database: config.DEV_MYSQL_DATABASE,
		};
	}

	return dbConfig;
};

class Database {
	private static instance: Database;
	private connection: mysql.Connection;
	public query: (sql: string, values?: any) => Promise<any>;

	private constructor(config: DatabaseConfig) {
		// Initialize connection first
		this.connection = mysql.createConnection(config);
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
			const config = getDatabaseConfig();
			Database.instance = new Database(config);
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
	.route("/ongeki", ongekiSettingsRoute);

export { routes };

export type ApiRouteType = typeof routes;

export const db = Database.getInstance();
