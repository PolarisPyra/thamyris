import React from "react";

import { Outlet, Route } from "react-router-dom";

import ChunithmSettingsPage from "@/pages/chunithm/settings";
import OngekiSettingsPage from "@/pages/ongeki/settings";

export default (
	<Route path="settings" element={<Outlet />}>
		<Route path="chunithm" element={<ChunithmSettingsPage />} />
		<Route path="ongeki" element={<OngekiSettingsPage />} />
	</Route>
);
