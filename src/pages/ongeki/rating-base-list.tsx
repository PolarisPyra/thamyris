import React from "react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import OngekiRatingFrameTable from "@/components/ongeki/rating-table";
import OngekiRatingFrameTableNew from "@/components/ongeki/rating-table new";
import {
	useHighestRating,
	useNewHighestRating,
	useNewPlayerRating,
	useOngekiVersion,
	usePlayerRating,
	useUserNewRatingBaseBestList,
	useUserNewRatingBaseBestNewList,
	useUserNewRatingBaseNextBestList,
	useUserRatingBaseHotList,
	useUserRatingBaseList,
	useUserRatingBaseNewList,
	useUserRatingBaseNextList,
} from "@/hooks/ongeki";
import { useUserNewRatingBasePScoreList } from "@/hooks/ongeki/use-new-rating";

const OngekiRatingFrames = () => {
	const version = useOngekiVersion();

	const { data: baseSongs = [] } = useUserRatingBaseList();
	const { data: hotSongs = [] } = useUserRatingBaseHotList();
	const { data: newSongs = [] } = useUserRatingBaseNewList();
	const { data: nextSongs = [] } = useUserRatingBaseNextList();
	const { data: playerRating = [] } = usePlayerRating();
	const { data: highestRating = [] } = useHighestRating();

	const { data: newBaseSongs = [] } = useUserNewRatingBaseBestList();
	const { data: newNewSongs = [] } = useUserNewRatingBaseBestNewList();
	const { data: newNextSongs = [] } = useUserNewRatingBaseNextBestList();
	const { data: newPscoreSongs = [] } = useUserNewRatingBasePScoreList();

	const { data: newPlayerRating = [] } = useNewPlayerRating();
	const { data: newHighestRating = [] } = useNewHighestRating();

	const isRefreshOrAbove = Number(version) >= 8;

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
						<QouteCard
							header="Single track ratings are calculated from fumen constants and scores."
							welcomeMessage={
								<div className="flex flex-col space-y-1">
									{isRefreshOrAbove ? (
										<>
											<span>• (sum of NEW top 10) ÷ 50</span>
											<span>• (sum of BEST top 50) ÷ 50</span>
											<span>• (sum of PLATINUM top 50) ÷ 50</span>
										</>
									) : (
										<>
											<span>• 15 highest ratings from new version fumens</span>
											<span>• 30 highest ratings from old version fumens</span>
											<span>• 10 highest ratings from recent plays, excluding Lunatic difficulty</span>
										</>
									)}
									<div className="flex flex-col">
										{isRefreshOrAbove ? (
											<>
												<span className="text-primary font-bold">
													Player Rating: {((newPlayerRating[0]?.newPlayerRating ?? 0) / 1000).toFixed(3) || "Loading..."}
												</span>
												<span className="text-primary font-bold">
													Highest Rating: {((newHighestRating[0]?.newHighestRating ?? 0) / 1000).toFixed(3) || "Loading..."}
												</span>
											</>
										) : (
											<>
												<span className="text-primary font-bold">
													Player Rating: {((playerRating[0]?.playerRating ?? 0) / 100).toFixed(2) || "Loading..."}
												</span>
												<span className="text-primary font-bold">
													Highest Rating: {((highestRating[0]?.highestRating ?? 0) / 100).toFixed(2) || "Loading..."}
												</span>
											</>
										)}
									</div>
								</div>
							}
							color="#f067e9"
						/>
					</div>

					<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
						{isRefreshOrAbove ? (
							<>
								<OngekiRatingFrameTableNew data={newBaseSongs} title="Best 50" />
								<OngekiRatingFrameTableNew data={newPscoreSongs} title="Best 50 P-score" />
								<OngekiRatingFrameTableNew data={newNewSongs} title="Current Version" />
								<OngekiRatingFrameTableNew data={newNextSongs} title="Potential Plays" />
							</>
						) : (
							<>
								<OngekiRatingFrameTable data={baseSongs} title="Best 30" />
								<OngekiRatingFrameTable data={newSongs} title="Current Version" />
								<OngekiRatingFrameTable data={hotSongs} title="Recent" />
								<OngekiRatingFrameTable data={nextSongs} title="Potential Plays" />
							</>
						)}
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
