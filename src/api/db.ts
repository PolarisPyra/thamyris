import mysql from "mysql";
import util from "util";

import { env } from "@/env";

const getDbConnectionConfig = (): mysql.ConnectionConfig => {
	const isProduction = env.NODE_ENV === "production";

	// NOTE:
	//   Isn't the point of .env files to have different values for different environments?
	if (isProduction) {
		if (!env.PROD_MYSQL_HOST || !env.PROD_MYSQL_USERNAME || !env.PROD_MYSQL_PASSWORD || !env.PROD_MYSQL_DATABASE) {
			throw new Error("Missing required production database envuration");
		}
		return {
			host: env.PROD_MYSQL_HOST,
			user: env.PROD_MYSQL_USERNAME,
			password: env.PROD_MYSQL_PASSWORD,
			database: env.PROD_MYSQL_DATABASE,
			port: 3306,
		};
	} else {
		if (!env.DEV_MYSQL_HOST || !env.DEV_MYSQL_USERNAME || !env.DEV_MYSQL_PASSWORD || !env.DEV_MYSQL_DATABASE) {
			throw new Error("Missing required development database envuration");
		}
		return {
			host: env.DEV_MYSQL_HOST,
			user: env.DEV_MYSQL_USERNAME,
			password: env.DEV_MYSQL_PASSWORD,
			database: env.DEV_MYSQL_DATABASE,
			port: 3306,
		};
	}
};

type UpdateResult = { affectedRows: number };
export class Database {
	private static instance: Database;
	private connection: mysql.Connection;
	// TODO: Connection Pooling (right now it's just a single connection for all queries?)
	//       Transactions

	// Not used but serves as definition for the query method
	// @ts-expect-error
	public query<T = any>(sql: string, values?: any[]): Promise<T> {
		// This will be replaced in the constructor with the promisified version
		throw new Error("Query method not initialized");
	}

	// Select always returns an array of results, could maybe add a select one or something
	public select<T = any>(sql: string, values?: any[]): Promise<T[]> {
		return this.query<T[]>(sql, values) as Promise<T[]>;
	}

	public update(sql: string, values?: any[]): Promise<UpdateResult> {
		return this.query(sql, values) as Promise<UpdateResult>;
	}

	private constructor(config: mysql.ConnectionConfig) {
		// Initialize connection first
		this.connection = mysql.createConnection(config);

		// Initialize the promisified query with type annotations
		this.query = util.promisify(this.connection.query).bind(this.connection) as <T>(
			sql: string,
			values?: any[]
		) => Promise<T>;

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
			const config = getDbConnectionConfig();
			Database.instance = new Database(config);
		}
		return Database.instance;
	}
}

export const db = Database.getInstance();
