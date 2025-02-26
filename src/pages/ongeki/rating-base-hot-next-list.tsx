import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import RatingFrameTable from "@/components/common/rating-table";
import Spinner from "@/components/common/spinner";
import RatingBaseHotNextListTable from "@/components/ongeki/rating-base-hot-next-list-table";
import { useUsername } from "@/hooks/common/use-username";
import { useUserRatingBaseHotNextList } from "@/hooks/ongeki/use-rating";
import { getDifficultyFromOngekiChart } from "@/utils/helpers";

const ITEMS_PER_PAGE = 15;

const OngekiRatingFramesPotential = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: ratingList = [], isLoading: isLoadingRatingList } = useUserRatingBaseHotNextList();
	const { isLoading: isLoadingUsername } = useUsername();

	const totalRating = ratingList.reduce((sum, song) => sum + song.rating, 0);
	const averageRating = ratingList.length > 0 ? (totalRating / ratingList.length / 100).toFixed(2) : "0.00";

	const filteredSongs = ratingList.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	if (isLoadingRatingList || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Potential Plays" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Potential Plays" />
			<div className="container mx-auto space-y-6">
				<div className="grid py-6">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${averageRating}`}
						color="#f067e9"
						welcomeMessage={`Based on ${ratingList.length} songs`}
					/>
				</div>
				<RatingFrameTable
					songs={paginatedSongs.map((song) => ({
						title: song.title,
						score: song.score,
						level: song.level,
						difficulty: getDifficultyFromOngekiChart(song.chartId),
						genre: song.genre,
						artist: song.artist,
						rating: song.rating,
					}))}
					searchQuery={searchQuery}
					onSearchChange={(e) => setSearchQuery(e.target.value)}
				/>
				{totalPages > 1 && (
					<div className="mb-4 flex items-center justify-center space-x-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Previous
						</button>
						<span className="text-sm text-gray-300">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default OngekiRatingFramesPotential;
