import React from "react";

import ChunithmRatingFrameTable from "@/components/chunithm/rating-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import {
	useChunithmVersion,
	useHighestRating,
	usePlayerRating,
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
	const { data: highestRating = [] } = useHighestRating();
	const { data: playerRating = [] } = usePlayerRating();

	const isVerseOrAbove = Number(version) >= 17;

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							header={`Single track ratings are calculated from fumen constants and scores. Player rating is the average of ${isVerseOrAbove ? "50" : "30"} unique fumen ratings, including:`}
							welcomeMessage={
								<div className="flex flex-col space-y-1">
									{isVerseOrAbove ? (
										<>
											<span>• 30 highest ratings from old version fumens</span>
											<span>• 20 highest ratings from new version fumens</span>
										</>
									) : (
										<>
											<span>• Based on best 30 plays</span>
										</>
									)}
									<div className="mt-2 flex flex-col">
										<span className="text-primary font-bold">
											Player Rating: {((playerRating[0]?.playerRating ?? 0) / 100).toFixed(2) || "Loading..."}
										</span>
										<span className="text-primary font-bold">
											Highest Rating: {((highestRating[0]?.highestRating ?? 0) / 100).toFixed(2) || "Loading..."}
										</span>
									</div>
								</div>
							}
							color="#ffaa00"
						/>
					</div>

					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<ChunithmRatingFrameTable data={baseSongs} title="Best 30" />

						{isVerseOrAbove && (
							<>
								<ChunithmRatingFrameTable data={newSongs} title="Current Version" />
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
