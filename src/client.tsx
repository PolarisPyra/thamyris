import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { VersionCheck } from "./components/chunithm/version-check";
import { SidebarComponent } from "./components/common/sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./context/auth-provider";
import "./index.css";
import Account from "./pages/account/account";
import ChunithmAllSongs from "./pages/chunithm/allsongs";
import ChunithmFavorites from "./pages/chunithm/favorites";
import ChunithmRatingBaseList from "./pages/chunithm/rating-base-list";
import ChunithmRatingFramesPotential from "./pages/chunithm/rating-base-next-list";
import ChunithmRivals from "./pages/chunithm/rivals";
import ChunithmScorePage from "./pages/chunithm/scores";
import ChunithmSettingsPage from "./pages/chunithm/settings";
import ChunithmUserbox from "./pages/chunithm/userbox";
import ServerNews from "./pages/common/server-news";
import OngekiAllSongs from "./pages/ongeki/allsongs";
import OngekiRatingFramesPotential from "./pages/ongeki/rating-base-hot-next-list";
import OngekiRatingFrames from "./pages/ongeki/rating-base-list";
import OngekiScorePage from "./pages/ongeki/scores";
import OngekiSettingsPage from "./pages/ongeki/settings";
import { LoginPage } from "./pages/public/login-page";
import { NotFound } from "./pages/public/not-found";
import OverviewPage from "./pages/public/overview-page";
import SignUpPage from "./pages/public/signup-page";
import WelcomePage from "./pages/public/welcome-page";
import { ProtectedRoute } from "./utils/protected";

const queryClient = new QueryClient();
const app = (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<AuthProvider>
				<Toaster />
				<Routes>
					<Route path="/" element={<WelcomePage />} />
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/login" element={<LoginPage />} />

					<Route
						element={
							<div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100">
								<SidebarProvider>
									<SidebarComponent />
									<div className="flex flex-1 flex-col overflow-hidden">
										<Outlet />
									</div>
								</SidebarProvider>
							</div>
						}
					>
						<Route element={<ProtectedRoute />}>
							<Route path="/overview" element={<OverviewPage />} />
							<Route path="/news" element={<ServerNews />} />
							<Route path="/settings/chunithm" element={<ChunithmSettingsPage />} />
							<Route path="/settings/ongeki" element={<OngekiSettingsPage />} />
							<Route path="/ongeki/allsongs" element={<OngekiAllSongs />} />

							<Route path="/chunithm/userbox" element={<ChunithmUserbox />} />
							<Route path="/chunithm/scores" element={<ChunithmScorePage />} />
							<Route path="/chunithm/favorites" element={<ChunithmFavorites />} />
							<Route element={<VersionCheck />}>
								<Route path="/chunithm/potential" element={<ChunithmRatingFramesPotential />} />
							</Route>
							<Route path="/chunithm/allsongs" element={<ChunithmAllSongs />} />
							<Route path="/chunithm/rivals" element={<ChunithmRivals />} />
							<Route path="/ongeki/scores" element={<OngekiScorePage />} />
							<Route path="/chunithm/rating" element={<ChunithmRatingBaseList />} />
							<Route path="/ongeki/rating" element={<OngekiRatingFrames />} />
							<Route path="/ongeki/potential" element={<OngekiRatingFramesPotential />} />
							<Route path="/account" element={<Account />} />
						</Route>
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</QueryClientProvider>
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(env.USE_REACT_STRICT ? <React.StrictMode>{app}</React.StrictMode> : app);
