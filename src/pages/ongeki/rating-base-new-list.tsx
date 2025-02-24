import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { getDifficultyFromChartId } from "@/utils/helpers";
import { useUsername } from "@/hooks/common/use-username";
import { useUserRatingBaseNextList } from "@/hooks/ongeki/use-rating";
import RatingBaseBestListTable from "@/components/ongeki/rating-base-best-list-table";
const ITEMS_PER_PAGE = 15;

const OngekiRatingBestNewList = () => {
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

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="Potential Plays" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 gap-4">
					<QouteCard
						icon={Trophy}
						tagline="Next List"
						value={`Rating: ${averageRating}`}
						color="yellow"
						welcomeMessage={`Based on ${ratingList.length} potential plays`}
					/>
				</div>

				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Next List</h3>
					<RatingBaseBestListTable
						songs={formatSongs(paginatedSongs)}
						searchQuery={searchQuery}
						onSearchChange={(e) => setSearchQuery(e.target.value)}
					/>
					<div className="flex justify-center items-center space-x-4 mb-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentPage} of {Math.max(1, totalPages)}
						</span>
						<button
							disabled={currentPage === Math.max(1, totalPages)}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OngekiRatingBestNewList;
