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
				entryFileNames: `[name]-${buildHash}.js`,
				chunkFileNames: `assets/[name]-[hash]-${buildHash}.js`,
				assetFileNames: `assets/[name]-[hash]-${buildHash}.[ext]`,
				manualChunks(id) {
					// Core React and routing
					if (
						id.includes("node_modules/react/") ||
						id.includes("node_modules/react-dom/") ||
						id.includes("node_modules/react-router-dom/")
					) {
						return "vendor-react";
					}

					// Radix UI components - split into smaller chunks
					if (id.includes("node_modules/@radix-ui/react-")) {
						if (id.includes("/react-dialog/") || id.includes("/react-dropdown-menu/") || id.includes("/react-tooltip/")) {
							return "vendor-radix-popups";
						}
						if (id.includes("/react-avatar/") || id.includes("/react-separator/") || id.includes("/react-slot/")) {
							return "vendor-radix-basics";
						}
						return "vendor-radix-other";
					}

					// Data and state management
					if (id.includes("node_modules/@tanstack/react-query")) {
						return "vendor-tanstack";
					}

					// Date handling
					if (id.includes("node_modules/date-fns")) {
						return "vendor-dates";
					}

					// Charting and visualization
					if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) {
						return "vendor-charts";
					}

					// Animation and UI enhancements
					if (id.includes("node_modules/framer-motion")) {
						return "vendor-animations";
					}

					// UI utilities and icons
					if (
						id.includes("node_modules/lucide-react") ||
						id.includes("node_modules/clsx") ||
						id.includes("node_modules/tailwind-merge") ||
						id.includes("node_modules/class-variance-authority")
					) {
						return "vendor-ui-utils";
					}

					// Theme management
					if (id.includes("node_modules/next-themes")) {
						return "vendor-theming";
					}

					// Notifications and toast
					if (id.includes("node_modules/sonner")) {
						return "vendor-notifications";
					}

					// App-specific chunks by feature
					if (id.includes("/src/pages/chunithm/")) {
						return "feature-chunithm";
					}

					if (id.includes("/src/pages/ongeki/")) {
						return "feature-ongeki";
					}

					if (id.includes("/src/pages/account/")) {
						return "feature-account";
					}

					if (id.includes("/src/components/chunithm/")) {
						return "components-chunithm";
					}

					if (id.includes("/src/components/ongeki/")) {
						return "components-ongeki";
					}
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
