import React from "react";

import { Outlet, Route } from "react-router-dom";

import OngekiAllSongs from "@/pages/ongeki/allsongs";
import OngekiLeaderboard from "@/pages/ongeki/leaderboard";
import OngekiRatingFrames from "@/pages/ongeki/rating-base-list";
import OngekiRivals from "@/pages/ongeki/rivals";
import OngekiScorePage from "@/pages/ongeki/scores";
import { TechEvents } from "@/pages/ongeki/techevents";

export default (
	<Route path="ongeki" element={<Outlet />}>
		<Route path="allsongs" element={<OngekiAllSongs />} />
		<Route path="leaderboard" element={<OngekiLeaderboard />} />
		<Route path="rating" element={<OngekiRatingFrames />} />
		<Route path="rivals" element={<OngekiRivals />} />
		<Route path="scores" element={<OngekiScorePage />} />
		<Route path="techevent" element={<TechEvents />} />
	</Route>
);
