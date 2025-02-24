import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import RatingBaseHotListTable from "@/components/common/rating-base-hot-list-table";
import { useUserRatingBaseHotList } from "@/hooks/use-rating";
import { useUsername } from "@/hooks/use-scores";
import Spinner from "@/components/common/spinner";
import { getDifficultyFromChartId } from "@/utils/helpers";

const ChunithmRatingBaseHotList = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const { data: ratingList = [], isLoading: isLoadingRatingList } = useUserRatingBaseHotList();
	const { isLoading: isLoadingUsername } = useUsername();

	const totalRating = ratingList.reduce((sum, song) => sum + song.rating, 0);
	const averageRating =
		ratingList.length > 0 ? (totalRating / ratingList.length / 100).toFixed(2) : "0.00";

	const filteredSongs = ratingList.filter((song) =>
		song.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formattedSongs = filteredSongs.map((song) => ({
		title: song.title,
		score: song.score,
		level: song.level,
		difficulty: getDifficultyFromChartId(song.chartId),
		genre: song.genre,
		artist: song.artist,
		rating: song.rating,
	}));

	if (isLoadingRatingList || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Hot Plays" />
				<div className="flex justify-center items-center h-[calc(100vh-64px)]">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="Hot Plays" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<QouteCard
						icon={Trophy}
						tagline=""
						value={`Average Rating: ${averageRating}`}
						color="yellow"
						welcomeMessage={`Based on ${ratingList.length} songs`}
					/>
				</div>
				<RatingBaseHotListTable
					songs={formattedSongs}
					searchQuery={searchQuery}
					onSearchChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default ChunithmRatingBaseHotList;
