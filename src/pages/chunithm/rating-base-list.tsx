import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import RatingFrameTable from "@/components/common/rating-table";
import Spinner from "@/components/common/spinner";
import { useUserRatingBaseList, useUserRatingBaseNewList } from "@/hooks/chunithm/use-rating";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { useUsername } from "@/hooks/common/use-username";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

const ITEMS_PER_PAGE = 15;

const ChunithmRatingBaseList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentNewPage, setCurrentNewPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchNewQuery, setSearchNewQuery] = useState("");

	const { data: baseSongs = [], isLoading: isLoadingBaseList } = useUserRatingBaseList();
	const { data: newSongs = [], isLoading: isLoadingNewList } = useUserRatingBaseNewList();
	const { isLoading: isLoadingUsername } = useUsername();
	const { data: version } = useChunithmVersion();

	const totalBaseRating = baseSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalNewRating = newSongs.reduce((sum, song) => sum + song.rating, 0);

	const averageBaseRating = baseSongs.length > 0 ? (totalBaseRating / baseSongs.length / 100).toFixed(2) : "0.00";
	const averageNewRating = newSongs.length > 0 ? (totalNewRating / newSongs.length / 100).toFixed(2) : "0.00";

	// Filter base songs by search
	const filteredBaseSongs = baseSongs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	// Filter new songs by search
	const filteredNewSongs = newSongs.filter((song) => song.title.toLowerCase().includes(searchNewQuery.toLowerCase()));

	const totalBasePages = Math.ceil(filteredBaseSongs.length / ITEMS_PER_PAGE);
	const totalNewPages = Math.ceil(filteredNewSongs.length / ITEMS_PER_PAGE);

	const paginatedBaseSongs = filteredBaseSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const paginatedNewSongs = filteredNewSongs.slice(
		(currentNewPage - 1) * ITEMS_PER_PAGE,
		currentNewPage * ITEMS_PER_PAGE
	);

	if (isLoadingBaseList || isLoadingNewList || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Rating Frame" />
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
			<Header title="Rating Frame" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${averageBaseRating}`}
						color="yellow"
						welcomeMessage={`Based on ${baseSongs.length} base plays`}
					/>
					{(version ?? 0) >= 17 && (
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${averageNewRating}`}
							color="yellow"
							welcomeMessage={`Based on ${newSongs.length} new plays`}
						/>
					)}
				</div>

				{/* Base 30 Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Highest Rating</h3>
					<RatingFrameTable
						songs={paginatedBaseSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromChunithmChart(song.chartId),
							genre: song.genre,
							artist: song.artist,
							rating: song.rating,
							type: song.type,
						}))}
						searchQuery={searchQuery}
						onSearchChange={(e) => setSearchQuery(e.target.value)}
					/>
					{totalBasePages > 1 && (
						<div className="mb-4 flex items-center justify-center space-x-4">
							<button
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((prev) => prev - 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-300">
								Page {currentPage} of {totalBasePages}
							</span>
							<button
								disabled={currentPage === totalBasePages}
								onClick={() => setCurrentPage((prev) => prev + 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</div>

				{/* New 20 Table - Only show if version >= 17 */}
				{(version ?? 0) >= 17 && (
					<div className="space-y-4">
						<h3 className="text-xl font-semibold text-gray-100">Current Version</h3>
						<RatingFrameTable
							songs={paginatedNewSongs.map((song) => ({
								title: song.title,
								score: song.score,
								level: song.level,
								difficulty: getDifficultyFromChunithmChart(song.chartId),
								genre: song.genre,
								artist: song.artist,
								rating: song.rating,
								type: song.type,
							}))}
							searchQuery={searchNewQuery}
							onSearchChange={(e) => setSearchNewQuery(e.target.value)}
						/>
						{totalNewPages > 1 && (
							<div className="mb-4 flex items-center justify-center space-x-4">
								<button
									disabled={currentNewPage === 1}
									onClick={() => setCurrentNewPage((prev) => prev - 1)}
									className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Previous
								</button>
								<span className="text-sm text-gray-300">
									Page {currentNewPage} of {totalNewPages}
								</span>
								<button
									disabled={currentNewPage === totalNewPages}
									onClick={() => setCurrentNewPage((prev) => prev + 1)}
									className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Next
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChunithmRatingBaseList;
