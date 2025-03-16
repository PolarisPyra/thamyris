import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./context/auth";
import { ThemeProvider } from "./context/theme";
import "./index.css";
import AppRoutes from "./routes";

const queryClient = new QueryClient();

const app = (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider>
					<Toaster />
					<AppRoutes />
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	</QueryClientProvider>
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(env.USE_REACT_STRICT ? <React.StrictMode>{app}</React.StrictMode> : app);
