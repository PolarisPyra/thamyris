import React from "react";

import { Outlet, Route } from "react-router-dom";

import ChunithmAllSongs from "@/pages/chunithm/allsongs";
import ChunithmFavorites from "@/pages/chunithm/favorites";
import ChunithmLeaderboard from "@/pages/chunithm/leaderboard";
import ChunithmRatingBaseList from "@/pages/chunithm/rating-base-list";
import ChunithmRivals from "@/pages/chunithm/rivals";
import ChunithmScorePage from "@/pages/chunithm/scores";
import ChunithmUserbox from "@/pages/chunithm/userbox";

export default (
	<Route path="chunithm" element={<Outlet />}>
		<Route path="allsongs" element={<ChunithmAllSongs />} />
		<Route path="favorites" element={<ChunithmFavorites />} />
		<Route path="leaderboard" element={<ChunithmLeaderboard />} />
		<Route path="rating" element={<ChunithmRatingBaseList />} />
		<Route path="rivals" element={<ChunithmRivals />} />
		<Route path="scores" element={<ChunithmScorePage />} />
		<Route path="userbox" element={<ChunithmUserbox />} />
	</Route>
);
