import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import RatingFrameTable from "@/components/chunithm/rating-table";
import ChunithmRatingFrameTable from "@/components/chunithm/rating-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import {
	useChunithmVersion,
	useUserRatingBaseHotList,
	useUserRatingBaseList,
	useUserRatingBaseNewList,
	useUserRatingBaseNextList,
} from "@/hooks/chunithm";

const ChunithmRatingFrames = () => {
	const version = useChunithmVersion();
	const { data: baseSongs = [] } = useUserRatingBaseList();
	const { data: hotSongs = [] } = useUserRatingBaseHotList();
	const { data: newSongs = [] } = useUserRatingBaseNewList();
	const { data: nextSongs = [] } = useUserRatingBaseNextList();

	const isVerseOrAbove = Number(version) >= 17;

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
							color="#ffaa00"
							welcomeMessage={`Based on ${baseSongs.length} best plays`}
						/>
					</div>

					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<ChunithmRatingFrameTable data={baseSongs} title="Best 30" />

						{isVerseOrAbove && (
							<>
								<RatingFrameTable data={newSongs} title="Current Version" />
							</>
						)}

						<ChunithmRatingFrameTable data={hotSongs} title="Recent" />

						{isVerseOrAbove && <ChunithmRatingFrameTable data={nextSongs} title="Potential Plays" />}
					</div>
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmRatingFrames;
