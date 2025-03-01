import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import QouteCard from "@/components/common/qoutecard";
import RatingFrameTable from "@/components/common/rating-table";
import Spinner from "@/components/common/spinner";
import { useUsername } from "@/hooks/common/use-username";
import {
	useUserRatingBaseBestList,
	useUserRatingBaseBestNewList,
	useUserRatingBaseHotList,
	useUserRatingBaseNextList,
} from "@/hooks/ongeki/use-rating";
import { getDifficultyFromOngekiChart } from "@/utils/helpers";

const itemsPerPage = 15;

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
	const { data: nextList = [], isLoading: isLoadingNextList } = useUserRatingBaseNextList();
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

	const totalSongsCount = baseSongs.length + newSongs.length + hotSongs.length;

	const totalCombinedRating = totalBaseRating + totalNewRating + totalHotRating;
	const totalAverageRating = totalSongsCount > 0 ? (totalCombinedRating / totalSongsCount / 100).toFixed(2) : "0.00";

	// Filter songs by search
	const filteredBaseSongs = baseSongs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));
	const filteredNewSongs = newSongs.filter((song) => song.title.toLowerCase().includes(searchNewQuery.toLowerCase()));
	const filteredHotSongs = hotSongs.filter((song) => song.title.toLowerCase().includes(searchHotQuery.toLowerCase()));
	const filteredNextSongs = nextSongs.filter((song) => song.title.toLowerCase().includes(searchNextQuery.toLowerCase()));

	const totalBasePages = Math.ceil(filteredBaseSongs.length / itemsPerPage);
	const totalNewPages = Math.ceil(filteredNewSongs.length / itemsPerPage);
	const totalHotPages = Math.ceil(filteredHotSongs.length / itemsPerPage);
	const totalNextPages = Math.ceil(filteredNextSongs.length / itemsPerPage);

	const paginatedBaseSongs = filteredBaseSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const paginatedNewSongs = filteredNewSongs.slice((currentNewPage - 1) * itemsPerPage, currentNewPage * itemsPerPage);
	const paginatedHotSongs = filteredHotSongs.slice((currentHotPage - 1) * itemsPerPage, currentHotPage * itemsPerPage);
	const paginatedNextSongs = filteredNextSongs.slice(
		(currentNextPage - 1) * itemsPerPage,
		currentNextPage * itemsPerPage
	);

	if (isLoadingBaseList || isLoadingNewList || isLoadingNextList || isLoadingHotList || isLoadingUsername) {
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
				<div className="gap-4 p-4 py-6 sm:p-0 md:grid-cols-2 md:p-0 lg:grid-cols-3 lg:p-0 xl:p-0 2xl:p-0">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline=""
						value={`Average Rating: ${totalAverageRating}`}
						color="#f067e9"
						welcomeMessage={`Based on ${baseSongs.length} best plays, ${hotSongs.length} recent plays and ${newSongs.length} current version plays`}
					/>
				</div>

				{/* All tables wrapped in a single div with padding classes */}
				<div className="p-4 sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-0">
					{/* Base List Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Best 30</h3>
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
						<Pagination currentPage={currentPage} totalPages={totalBasePages} onPageChange={setCurrentPage} />
					)}

					{/* Hot List Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Recent</h3>
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
						<Pagination currentPage={currentHotPage} totalPages={totalHotPages} onPageChange={setCurrentHotPage} />
					)}

					{/* New List Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Current Version</h3>
					<RatingFrameTable
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
						<Pagination currentPage={currentNewPage} totalPages={totalNewPages} onPageChange={setCurrentNewPage} />
					)}

					{/* Potential Plays Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Potential Plays</h3>
					<div className="pb-4">
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
					</div>
					{totalNextPages > 1 && (
						<Pagination currentPage={currentNextPage} totalPages={totalNextPages} onPageChange={setCurrentNextPage} />
					)}
				</div>
			</div>
		</div>
	);
};

export default OngekiRatingFrames;
