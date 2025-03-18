import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import OngekiRatingFrameTable from "@/components/ongeki/rating-table";
import {
	useOngekiVersion,
	useUserRatingBaseHotList,
	useUserRatingBaseList,
	useUserRatingBaseNewList,
	useUserRatingBaseNextList,
} from "@/hooks/ongeki";

const OngekiRatingFrames = () => {
	const version = useOngekiVersion();

	const { data: baseSongs = [] } = useUserRatingBaseList();
	const { data: hotSongs = [] } = useUserRatingBaseHotList();
	const { data: newSongs = [] } = useUserRatingBaseNewList();
	const { data: nextSongs = [] } = useUserRatingBaseNextList();

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							// value={`Average Rating: ${totalAverageRating}`}
							color="#f067e9"
							welcomeMessage={`Based on ${baseSongs.length} best plays, and ${newSongs.length} current version plays`}
						/>
					</div>

					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<OngekiRatingFrameTable data={baseSongs} title="Best 30" />
						<OngekiRatingFrameTable data={newSongs} title="Current Version" />
						<OngekiRatingFrameTable data={hotSongs} title="Recent" />
						<OngekiRatingFrameTable data={nextSongs} title="Potential Plays" />
					</div>
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Ongeki version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default OngekiRatingFrames;
