/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Database type definitions for the application tables
 */
export namespace DB {
	export interface AimeUser {
		id: number;
		username: string;
		email: string;
		password: string;
		permissions: number;
		created_date: string;
		last_login_date: string;
		suspend_expire_time: string;
	}

	export interface AimeCard {
		id: number;
		user: number;
		access_code: string;
		idm: string;
		chip_id: number;
		created_date: string;
		last_login_date: string;
		is_locked: boolean;
		is_banned: boolean;
		memo: string;
	}
}
