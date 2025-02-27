import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import OngekiRatingTable from "@/components/common/rating-table";
import RatingFrameTable from "@/components/common/rating-table";
import Spinner from "@/components/common/spinner";
import { useUsername } from "@/hooks/common/use-username";
import {
	useUserRatingBaseBestList,
	useUserRatingBaseBestNewList,
	useUserRatingBaseHotList,
	useUserRatingBaseHotNextList,
} from "@/hooks/ongeki/use-rating";
import { getDifficultyFromOngekiChart } from "@/utils/helpers";

const ITEMS_PER_PAGE = 15;

const OngekiRatingFrames = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentNewPage, setCurrentNewPage] = useState(1);
	const [currentHotPage, setCurrentHotPage] = useState(1);
	const [currentNextPage, setCurrentNextPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchNewQuery, setSearchNewQuery] = useState("");
	const [searchHotQuery, setSearchHotQuery] = useState("");
	const [searchNextQuery, setSearchNextQuery] = useState("");

	const { data: baseList = [], isLoading: isLoadingBaseList } = useUserRatingBaseBestList();
	const { data: newList = [], isLoading: isLoadingNewList } = useUserRatingBaseBestNewList();
	const { data: hotList = [], isLoading: isLoadingHotList } = useUserRatingBaseHotList();
	const { data: nextList = [], isLoading: isLoadingNextList } = useUserRatingBaseHotNextList();
	const { isLoading: isLoadingUsername } = useUsername();

	// Separate base and new songs
	const baseSongs = baseList.filter((song) => song.musicId != 0);
	const newSongs = newList.filter((song) => song.musicId != 0);
	const hotSongs = hotList.filter((song) => song.musicId != 0);
	const nextSongs = nextList.filter((song) => song.musicId != 0);

	// Calculate total ratings
	const totalBaseRating = baseSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalNewRating = newSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalHotRating = hotSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalNextRating = nextSongs.reduce((sum, song) => sum + song.rating, 0);

	const totalSongsCount = baseSongs.length + newSongs.length + hotSongs.length;

	const totalCombinedRating = totalBaseRating + totalNewRating + totalHotRating;
	const totalAverageRating = totalSongsCount > 0 ? (totalCombinedRating / totalSongsCount / 100).toFixed(2) : "0.00";
	const averageNextRating = nextSongs.length > 0 ? (totalNextRating / nextSongs.length / 100).toFixed(2) : "0.00";

	// Filter songs by search
	const filteredBaseSongs = baseSongs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));
	const filteredNewSongs = newSongs.filter((song) => song.title.toLowerCase().includes(searchNewQuery.toLowerCase()));
	const filteredHotSongs = hotSongs.filter((song) => song.title.toLowerCase().includes(searchHotQuery.toLowerCase()));
	const filteredNextSongs = nextSongs.filter((song) => song.title.toLowerCase().includes(searchNextQuery.toLowerCase()));

	const totalBasePages = Math.ceil(filteredBaseSongs.length / ITEMS_PER_PAGE);
	const totalNewPages = Math.ceil(filteredNewSongs.length / ITEMS_PER_PAGE);
	const totalHotPages = Math.ceil(filteredHotSongs.length / ITEMS_PER_PAGE);
	const totalNextPages = Math.ceil(filteredNextSongs.length / ITEMS_PER_PAGE);

	const paginatedBaseSongs = filteredBaseSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
	const paginatedNewSongs = filteredNewSongs.slice(
		(currentNewPage - 1) * ITEMS_PER_PAGE,
		currentNewPage * ITEMS_PER_PAGE
	);
	const paginatedHotSongs = filteredHotSongs.slice(
		(currentHotPage - 1) * ITEMS_PER_PAGE,
		currentHotPage * ITEMS_PER_PAGE
	);
	const paginatedNextSongs = filteredNextSongs.slice(
		(currentNextPage - 1) * ITEMS_PER_PAGE,
		currentNextPage * ITEMS_PER_PAGE
	);

	if (isLoadingBaseList || isLoadingNewList || isLoadingHotList || isLoadingNextList || isLoadingUsername) {
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
				{/* Quote Cards */}
				<div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 lg:grid-cols-3">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${totalAverageRating}`}
						color="#f067e9"
						welcomeMessage={`Based on ${newSongs.length} current version plays, ${baseSongs.length} best plays and ${hotSongs.length} recent plays`}
					/>
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Potential Rating: ${averageNextRating}`}
						color="#f067e9"
						welcomeMessage={`Based on ${nextSongs.length} potential plays`}
					/>
				</div>

				{/* Base List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Best 30</h3>
					<RatingFrameTable
						songs={paginatedBaseSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromOngekiChart(song.chartId),
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

				{/* Hot List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Recent</h3>
					<RatingFrameTable
						songs={paginatedHotSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromOngekiChart(song.chartId),
							genre: song.genre,
							artist: song.artist,
							rating: song.rating,
							type: song.type,
						}))}
						searchQuery={searchHotQuery}
						onSearchChange={(e) => setSearchHotQuery(e.target.value)}
					/>
					{totalHotPages > 1 && (
						<div className="mb-4 flex items-center justify-center space-x-4">
							<button
								disabled={currentHotPage === 1}
								onClick={() => setCurrentHotPage((prev) => prev - 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-300">
								Page {currentHotPage} of {totalHotPages}
							</span>
							<button
								disabled={currentHotPage === totalHotPages}
								onClick={() => setCurrentHotPage((prev) => prev + 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</div>

				{/* New List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Current Version</h3>
					<OngekiRatingTable
						songs={paginatedNewSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromOngekiChart(song.chartId),
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

				{/* Potential Plays Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Potential Plays</h3>
					<RatingFrameTable
						songs={paginatedNextSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromOngekiChart(song.chartId),
							genre: song.genre,
							artist: song.artist,
							rating: song.rating,
							type: song.type,
						}))}
						searchQuery={searchNextQuery}
						onSearchChange={(e) => setSearchNextQuery(e.target.value)}
					/>
					{totalNextPages > 1 && (
						<div className="mb-4 flex items-center justify-center space-x-4">
							<button
								disabled={currentNextPage === 1}
								onClick={() => setCurrentNextPage((prev) => prev - 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Previous
							</button>
							<span className="text-sm text-gray-300">
								Page {currentNextPage} of {totalNextPages}
							</span>
							<button
								disabled={currentNextPage === totalNextPages}
								onClick={() => setCurrentNextPage((prev) => prev + 1)}
								className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Next
							</button>
						</div>
					)}
				</div>
				<div className="mb-4 flex items-center justify-center space-x-4" />
			</div>
		</div>
	);
};

export default OngekiRatingFrames;
