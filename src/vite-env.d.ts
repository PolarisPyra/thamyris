/// <reference types="vite/client" />

interface ClientEnv {
	// Any custom env variables set in
	// vite.config.ts -> define -> env
	readonly CDN_URL: string;
	readonly BUILD_HASH: string;
	readonly BUILD_HASH: string;
	readonly CFTurnstileKey: string;
	readonly BUILD_DATE_YEAR_MONTH_DAY: string;
	readonly BUILD_TIME_12_HOUR: string;
	// Meh, could just expose the NODE_ENV
	// directly instead of this
	readonly USE_REACT_STRICT: boolean;
}

declare const env: ClientEnv;
