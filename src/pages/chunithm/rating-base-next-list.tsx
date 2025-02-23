import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import RatingBaseNextListTable from "@/components/common/rating-base-next-list-table";
import { useUserRatingBaseNextList } from "@/hooks/use-rating";
import { useUsername } from "@/hooks/use-scores";
import Spinner from "@/components/common/spinner";
import { getDifficultyFromChartId } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 15;

const ChunithmRatingBaseNextList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: ratingList = [], isLoading: isLoadingRatingList } = useUserRatingBaseNextList();
	const { isLoading: isLoadingUsername } = useUsername();

	const totalRating = ratingList.reduce((sum, song) => sum + song.rating, 0);
	const averageRating =
		ratingList.length > 0 ? (totalRating / ratingList.length / 100).toFixed(2) : "0.00";

	const filteredSongs = ratingList.filter((song) =>
		song.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const formattedSongs = paginatedSongs.map((song) => ({
		title: song.title,
		score: song.score,
		level: song.level,
		difficulty: getDifficultyFromChartId(song.chartId),
		genre: song.genre,
		artist: song.artist,
		rating: song.rating,
		type: song.type,
	}));

	if (isLoadingRatingList || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Potential Plays" />
				<div className="flex justify-center items-center h-[calc(100vh-64px)]">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	const newNextListCount = ratingList.filter(
		(song) => song.type === "userRatingBaseNewNextList"
	).length;

	return (
		<div className="flex-1 overflow-auto p-4 relative">
			<Header title="Rating Base Next List" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<QouteCard
						icon={Trophy}
						tagline="Potential Rating"
						value={averageRating}
						color="yellow"
						welcomeMessage={`Based on ${newNextListCount} new potential songs`}
					/>
				</div>
				<RatingBaseNextListTable
					songs={formattedSongs}
					searchQuery={searchQuery}
					onSearchChange={(e) => setSearchQuery(e.target.value)}
				/>
				{totalPages > 1 && (
					<div className="flex justify-center gap-2 mt-4">
						<Button
							variant="outline"
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<span className="flex items-center px-4 py-2 bg-gray-700 rounded-md">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChunithmRatingBaseNextList;
