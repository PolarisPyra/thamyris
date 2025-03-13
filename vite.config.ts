import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { env } from "./src/env";

// Generate a random hash for cache busting
const buildHash = Math.floor(Math.random() * 90000) + 10000;

const buildDateYearMonthDay = (date) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const buildTime12HourFormat = (date) => {
	const d = new Date(date);
	let hours = d.getHours();
	const minutes = String(d.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	return `${hours}:${minutes} ${ampm}`;
};

export default defineConfig({
	ssr: {
		external: ["react", "react-dom"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				client: "./src/client.tsx",
			},
			output: {
				entryFileNames: `[name]` + buildHash + `.js`,
				chunkFileNames: `assets/[name]` + buildHash + `.js`,
				assetFileNames: `assets/[name]` + buildHash + `.[ext]`,
				manualChunks: {
					"react-vendor": ["react", "react-dom", "react-router-dom"],
					"ui-components": [
						"@radix-ui/react-avatar",
						"@radix-ui/react-dialog",
						"@radix-ui/react-dropdown-menu",
						"@radix-ui/react-separator",
						"@radix-ui/react-slot",
						"@radix-ui/react-tooltip",
					],
					"chart-vendor": ["recharts"],
					"animation-vendor": ["framer-motion"],
					"query-vendor": ["@tanstack/react-query"],
				},
			},
		},
		minify: true,
		emptyOutDir: true,
		copyPublicDir: true,
	},
	assetsInclude: ["**/*.png"],
	plugins: [tsconfigPaths(), tailwindcss()],
	base: "/",
	server: {
		proxy: {
			"/api": {
				target: `http://${env.DOMAIN}:${env.SERVER_PORT}`,
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path,
			},
		},
		port: env.CLIENT_PORT,
		cors: {
			origin: true,
			credentials: true,
		},
		host: true,
		allowedHosts: ["daphnis.app"],
	},
	define: {
		// For client env variables, add the type in src/vite-env.d.ts
		env: {
			BUILD_DATE_YEAR_MONTH_DAY: buildDateYearMonthDay(new Date().toISOString()),
			BUILD_TIME_12_HOUR: buildTime12HourFormat(new Date().toISOString()),
			CDN_URL: env.CDN_URL,
			USE_REACT_STRICT: JSON.stringify(env.NODE_ENV === "development"),
			BUILD_HASH: buildHash,
		},
	},
});
