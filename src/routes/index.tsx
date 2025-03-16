import React from "react";

import { Outlet, Route, Routes } from "react-router-dom";

import { LoginContent } from "@/components/common/login";
import { SidebarComponent } from "@/components/common/sidebar";
import SignUpContent from "@/components/common/signup";
import { SidebarProvider } from "@/components/ui/sidebar";
import Account from "@/pages/account/account";
import { NotFound } from "@/pages/common/not-found";
import OverviewPage from "@/pages/common/overview-page";
import ServerNews from "@/pages/common/server-news";
import WelcomePage, { WelcomeContent } from "@/pages/public/welcome-page";
import { ProtectedRoute } from "@/utils/protected";

import ChunithmRouter from "./chunithm";
import OngekiRouter from "./ongeki";
import SettingsRouter from "./settings";

export default () => (
	<Routes>
		<Route path="" element={<WelcomePage />}>
			<Route index element={<WelcomeContent />} />
			<Route path="signup" element={<SignUpContent />} />
			<Route path="login" element={<LoginContent />} />
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
				<Route path="account" element={<Account />} />

				<Route path="overview" element={<OverviewPage />} />
				<Route path="news" element={<ServerNews />} />

				{ChunithmRouter}
				{OngekiRouter}

				{SettingsRouter}
			</Route>
		</Route>

		<Route path="*" element={<NotFound />} />
	</Routes>
);
