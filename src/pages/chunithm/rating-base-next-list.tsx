import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { ChartNoAxesCombined } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import RatingBaseNextListTable from "@/components/chunithm/rating-base-next-list-table";
import { useUserRatingBaseNextList } from "@/hooks/chunithm/use-rating";
import Spinner from "@/components/common/spinner";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";
import { useUsername } from "@/hooks/common/use-username";
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

	const formatSongs = (songs: typeof ratingList) =>
		songs.map((song) => ({
			title: song.title,
			score: song.score,
			level: song.level,
			chartIdToDifficulty: getDifficultyFromChunithmChart(song.chartId),
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
		<div className="flex-1 overflow-auto relative">
			<Header title="Potential Plays" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${averageRating}`}
						color="yellow"
						welcomeMessage={`Based on ${newNextListCount} new potential plays`}
					/>
				</div>
				<RatingBaseNextListTable
					songs={formatSongs(paginatedSongs)}
					searchQuery={searchQuery}
					onSearchChange={(e) => setSearchQuery(e.target.value)}
				/>
				{totalPages > 1 && (
					<div className="flex justify-center items-center space-x-4 mb-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChunithmRatingBaseNextList;
