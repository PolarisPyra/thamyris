import React from "react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import OngekiRatingFrameTable from "@/components/ongeki/rating-table";
import {
	useHighestRating,
	useOngekiVersion,
	usePlayerRating,
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
	const { data: playerRating = [] } = usePlayerRating();
	const { data: highestRating = [] } = useHighestRating();

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							header="Single track ratings are calculated from fumen constants and scores. Player rating is the average of 55 unique fumen ratings, including:"
							welcomeMessage={
								<div className="flex flex-col space-y-1">
									<span>• 15 highest ratings from new version fumens</span>
									<span>• 30 highest ratings from old version fumens</span>
									<span>• 10 highest ratings from recent plays, excluding Lunatic difficulty</span>
									<div className="flex flex-col">
										<span className="text-primary font-bold">
											Player Rating: {((playerRating[0]?.playerRating ?? 0) / 100).toFixed(2) || "Loading..."}
										</span>
										<span className="text-primary font-bold">
											Highest Rating: {((highestRating[0]?.highestRating ?? 0) / 100).toFixed(2) || "Loading..."}
										</span>
									</div>
								</div>
							}
							color="#f067e9"
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
