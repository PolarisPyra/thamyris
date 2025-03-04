import { useMemo } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import RatingFrameTable from "@/components/common/rating-table";
import {
	useUserRatingBaseHotList,
	useUserRatingBaseList,
	useUserRatingBaseNewList,
	useUserRatingBaseNextList,
} from "@/hooks/chunithm/use-rating";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const ChunithmRatingFrames = () => {
	const { data: version } = useChunithmVersion();
	const { data: baseSongs = [] } = useUserRatingBaseList();
	const { data: hotSongs = [] } = useUserRatingBaseHotList();
	const { data: newSongs = [] } = useUserRatingBaseNewList();
	const { data: nextSongs = [] } = useUserRatingBaseNextList();

	const totalAverageRating = useMemo(() => {
		const totalSongs = [...baseSongs, ...newSongs, ...hotSongs];
		const totalRating = totalSongs.reduce((sum, song) => sum + song.rating, 0);
		return totalSongs.length > 0 ? (totalRating / totalSongs.length / 100).toFixed(2) : "0.00";
	}, [baseSongs, newSongs, hotSongs]);

	const isVerseOrAbove = Number(version) >= 17;

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			<div className="container mx-auto space-y-6">
				<div className="gap-4 p-4 py-6 sm:p-0">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${totalAverageRating}`}
						color="#ffaa00"
						welcomeMessage={`Based on ${baseSongs.length} best plays, ${hotSongs.length} recent plays and ${newSongs.length} current version plays`}
					/>
				</div>

				<div className="mb-4sm:p-0 space-y-8 p-4">
					<RatingFrameTable data={baseSongs} title="Best 30" />

					{isVerseOrAbove && <RatingFrameTable data={newSongs} title="Current Version" />}

					<RatingFrameTable data={hotSongs} title="Recent" />

					{isVerseOrAbove && <RatingFrameTable data={nextSongs} title="Potential Plays" />}
				</div>
			</div>
		</div>
	);
};

export default ChunithmRatingFrames;
