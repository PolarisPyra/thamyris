import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { LoginContent } from "./components/common/login";
import { SidebarComponent } from "./components/common/sidebar";
import SignUpContent from "./components/common/signup";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./context/auth";
import { ThemeProvider } from "./context/theme";
import "./index.css";
import Account from "./pages/account/account";
import Arcade from "./pages/account/arcade";
import ChunithmAllSongs from "./pages/chunithm/allsongs";
import ChunithmFavorites from "./pages/chunithm/favorites";
import ChunithmLeaderboard from "./pages/chunithm/leaderboard";
import ChunithmRatingBaseList from "./pages/chunithm/rating-base-list";
import ChunithmRivals from "./pages/chunithm/rivals";
import ChunithmScorePage from "./pages/chunithm/scores";
import ChunithmSettingsPage from "./pages/chunithm/settings";
import ChunithmUserbox from "./pages/chunithm/userbox";
import { NotFound } from "./pages/common/not-found";
import OverviewPage from "./pages/common/overview-page";
import ServerNews from "./pages/common/server-news";
import MaimaiScores from "./pages/maimai/scores";
import OngekiAllSongs from "./pages/ongeki/allsongs";
import OngekiLeaderboard from "./pages/ongeki/leaderboard";
import OngekiRatingFrames from "./pages/ongeki/rating-base-list";
import OngekiRivals from "./pages/ongeki/rivals";
import OngekiScorePage from "./pages/ongeki/scores";
import OngekiSettingsPage from "./pages/ongeki/settings";
import WelcomePage, { WelcomeContent } from "./pages/public/welcome-page";
import { ProtectedRoute } from "./utils/protected";

const queryClient = new QueryClient();

const app = (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider>
					<Toaster />

					<Routes>
						<Route path="/" element={<WelcomePage />}>
							<Route index element={<WelcomeContent />} />
							<Route path="/signup" element={<SignUpContent />} />
							<Route path="/login" element={<LoginContent />} />
						</Route>
						{/* Protected routes with sidebar */}
						<Route element={<ProtectedRoute />}>
							<Route
								element={
									<div className="bg-background text-foreground flex h-screen overflow-hidden">
										<SidebarProvider>
											<SidebarComponent />
											<div className="flex flex-1 flex-col overflow-hidden">
												<Outlet />
											</div>
										</SidebarProvider>
									</div>
								}
							>
								<Route path="/overview" element={<OverviewPage />} />
								<Route path="/news" element={<ServerNews />} />
								<Route path="/account" element={<Account />} />
								<Route path="/arcade" element={<Arcade />} />

								<Route path="/settings/chunithm" element={<ChunithmSettingsPage />} />
								<Route path="/chunithm/userbox" element={<ChunithmUserbox />} />
								<Route path="/chunithm/scores" element={<ChunithmScorePage />} />
								<Route path="/chunithm/favorites" element={<ChunithmFavorites />} />
								<Route path="/chunithm/leaderboard" element={<ChunithmLeaderboard />} />
								<Route path="/chunithm/allsongs" element={<ChunithmAllSongs />} />
								<Route path="/chunithm/rivals" element={<ChunithmRivals />} />

								<Route path="/settings/ongeki" element={<OngekiSettingsPage />} />
								<Route path="/ongeki/allsongs" element={<OngekiAllSongs />} />
								<Route path="/ongeki/scores" element={<OngekiScorePage />} />
								<Route path="/chunithm/rating" element={<ChunithmRatingBaseList />} />
								<Route path="/ongeki/rating" element={<OngekiRatingFrames />} />
								<Route path="/ongeki/rating" element={<OngekiRatingFrames />} />
								<Route path="/ongeki/leaderboard" element={<OngekiLeaderboard />} />
								<Route path="/ongeki/rivals" element={<OngekiRivals />} />

								<Route path="/maimai/scores" element={<MaimaiScores />} />
							</Route>
						</Route>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	</QueryClientProvider>
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(env.USE_REACT_STRICT ? <React.StrictMode>{app}</React.StrictMode> : app);
