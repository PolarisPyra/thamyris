/**
 * Type definitions for the database tables;
 */

export namespace DB {
	// aime_user
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

	// aime_card
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
