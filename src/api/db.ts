import mysql, { MysqlError } from "mysql";

import { env } from "@/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
// When every query is typed, this can be removed :)

const getDbConnectionConfig = (): mysql.PoolActualConfig => {
	const {
		NODE_ENV,
		DEV_MYSQL_HOST,
		DEV_MYSQL_USERNAME,
		DEV_MYSQL_PASSWORD,
		DEV_MYSQL_DATABASE,
		PROD_MYSQL_HOST,
		PROD_MYSQL_USERNAME,
		PROD_MYSQL_PASSWORD,
		PROD_MYSQL_DATABASE,
	} = env;

	const whatTheHeckIsAEnvFileAnyways = NODE_ENV === "production";
	const connectionConfig: mysql.ConnectionConfig = {
		host: whatTheHeckIsAEnvFileAnyways ? PROD_MYSQL_HOST : DEV_MYSQL_HOST,
		user: whatTheHeckIsAEnvFileAnyways ? PROD_MYSQL_USERNAME : DEV_MYSQL_USERNAME,
		password: whatTheHeckIsAEnvFileAnyways ? PROD_MYSQL_PASSWORD : DEV_MYSQL_PASSWORD,
		database: whatTheHeckIsAEnvFileAnyways ? PROD_MYSQL_DATABASE : DEV_MYSQL_DATABASE,
		port: 3306,
	};
	const dbConfig: mysql.PoolActualConfig = {
		connectionConfig,
		// defaults are fine... for now
	};

	// validate
	for (const [key, value] of Object.entries(dbConfig)) {
		if (!value) {
			throw new Error(`Missing required database configuration: ${key}`);
		}
	}
	return dbConfig;
};

// Bunch of bs to promisify the mysql connection and type the results.
class Connection {
	private connection: mysql.PoolConnection;
	private originalQuery: mysql.Connection["query"];

	constructor(connection: mysql.PoolConnection) {
		this.connection = connection;
		this.originalQuery = connection.query.bind(connection);

		this.connection.on("error", (err: MysqlError) => {
			console.error("Database error:", err);
			if (err.code === "PROTOCOL_CONNECTION_LOST") {
				this.connection.connect();
			} else {
				throw err;
			}
		});
	}

	release(): void {
		this.connection.release();
	}

	async query<T = any>(sql: string, values?: any[]): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.originalQuery(sql, values, (error: MysqlError | null, results: T) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	}

	async select<T = any>(sql: string, values?: any[]): Promise<T[]> {
		return this.query<T[]>(sql, values);
	}

	async update(sql: string, values?: any[]): Promise<{ affectedRows: number }> {
		return this.query<{ affectedRows: number }>(sql, values);
	}

	async beginTransaction(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.beginTransaction((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	async commit(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.commit((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	async rollback(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.rollback((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}

export class Database {
	private static pool: mysql.Pool = ((): mysql.Pool => {
		console.log("Creating DB Pool...");
		const pool = mysql.createPool(getDbConnectionConfig());
		console.log("DB Pool created with parameters:", {
			connectConfig: {
				...pool.config.connectionConfig,
				password: "********",
				pool: undefined,
			},
			poolConfig: {
				...pool.config,
				connectionConfig: undefined,
			},
		});
		return pool;
	})();

	// I don't trust the connections to be released properly
	// so not exposing this method
	private static async getConnection(): Promise<Connection> {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((error, mysqlConnection) => {
				if (error) {
					reject(error);
					return;
				}

				const connection = new Connection(mysqlConnection);
				resolve(connection);
			});
		});
	}

	private static async withConnection<T>(callback: (connection: Connection) => Promise<T>): Promise<T> {
		const connection = await this.getConnection();

		try {
			return await callback(connection);
		} finally {
			connection.release();
		}
	}

	// Creates a transaction and runs the callback within it
	static async inTransaction<T>(callback: (connection: Connection) => Promise<T>): Promise<T> {
		const connection = await this.getConnection();

		try {
			await connection.beginTransaction();
			const result = await callback(connection);
			await connection.commit();
			return result;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// Single-use methods
	static async query<T = any>(sql: string, values?: any[]): Promise<T> {
		return this.withConnection((conn) => conn.query<T>(sql, values));
	}

	static async select<T = any>(sql: string, values?: any[]): Promise<T[]> {
		return this.withConnection((conn) => conn.select<T>(sql, values));
	}

	static async update(sql: string, values?: any[]): Promise<{ affectedRows: number }> {
		return this.withConnection((conn) => conn.update(sql, values));
	}
}

// Backwards compatibility layer
export const db = {
	//  Single-use methods
	query: Database.query.bind(Database),
	select: Database.select.bind(Database),
	update: Database.update.bind(Database),

	// Transaction methods (use this for multiple queries that should be run atomically)
	// Example:
	// await db.inTransaction(async (conn) => {
	//   await conn.query("INSERT INTO ...");
	//   await conn.query("UPDATE ...");
	// });
	//
	// If either query throws an error, both are rolled back and no changes are made.
	inTransaction: Database.inTransaction.bind(Database),
};

export default db;
