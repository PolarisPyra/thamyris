import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import OngekiRatingFrameTable from "@/components/ongeki/rating-table";
import {
	useUserRatingBaseBestList,
	useUserRatingBaseBestNewList,
	useUserRatingBaseHotList,
	useUserRatingBaseNextList,
} from "@/hooks/ongeki/use-rating";
import { useOngekiVersion } from "@/hooks/ongeki/use-version";

const OngekiRatingFrames = () => {
	const { data: version } = useOngekiVersion();
	const { data: baseSongs = [] } = useUserRatingBaseBestList();
	const { data: hotSongs = [] } = useUserRatingBaseHotList();
	const { data: newSongs = [] } = useUserRatingBaseBestNewList();
	const { data: nextSongs = [] } = useUserRatingBaseNextList();

	const totalSongs = [...baseSongs, ...newSongs, ...hotSongs];
	const totalRating = totalSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalAverageRating = totalSongs.length > 0 ? (totalRating / totalSongs.length / 100).toFixed(2) : "0.00";

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${totalAverageRating}`}
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
