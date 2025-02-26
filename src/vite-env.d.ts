/// <reference types="vite/client" />

interface ClientEnv {
	// Any custom env variables set in
	// vite.config.ts -> define -> env
	readonly CDN_URL: string;

	// Meh, could just expose the NODE_ENV
	// directly instead of this
	readonly USE_REACT_STRICT: boolean;
}

declare const env: ClientEnv;
