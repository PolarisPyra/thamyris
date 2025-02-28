import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import RatingFrameTable from "@/components/common/rating-table";
import Spinner from "@/components/common/spinner";
import {
	useUserRatingBaseHotList,
	useUserRatingBaseList,
	useUserRatingBaseNewList,
	useUserRatingBaseNextList,
} from "@/hooks/chunithm/use-rating";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { useUsername } from "@/hooks/common/use-username";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

const itemsPerPage = 15;

const ChunithmRatingBaseList = () => {
	const [currentHotPage, setCurrentHotPage] = useState(1);
	const [searchHotQuery, setSearchHotQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [currentNewPage, setCurrentNewPage] = useState(1);
	const [currentNextPage, setCurrentNextPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchNewQuery, setSearchNewQuery] = useState("");
	const [searchNextQuery, setSearchNextQuery] = useState("");

	const { data: baseSongs = [], isLoading: isLoadingBaseList } = useUserRatingBaseList();
	const { data: hotSongs = [], isLoading: isLoadingHotList } = useUserRatingBaseHotList();
	const { data: newSongs = [], isLoading: isLoadingNewList } = useUserRatingBaseNewList();
	const { data: nextSongs = [], isLoading: isLoadingNextList } = useUserRatingBaseNextList();

	const { isLoading: isLoadingUsername } = useUsername();
	const { data: version } = useChunithmVersion();

	const totalBaseRating = baseSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalNewRating = newSongs.reduce((sum, song) => sum + song.rating, 0);
	const totalNextRating = nextSongs.reduce((sum, song) => sum + song.rating, 0);

	const averageBaseRating = baseSongs.length > 0 ? (totalBaseRating / baseSongs.length / 100).toFixed(2) : "0.00";
	const averageNewRating = newSongs.length > 0 ? (totalNewRating / newSongs.length / 100).toFixed(2) : "0.00";
	const averageNextRating = nextSongs.length > 0 ? (totalNextRating / nextSongs.length / 100).toFixed(2) : "0.00";

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

	const newNextListCount = nextSongs.filter((song) => song.type === "userRatingBaseNewNextList").length;

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Rating Frame" />
			<div className="container mx-auto space-y-6">
				{(version ?? 0) >= 17 ? (
					<div className="grid grid-cols-1 gap-4 p-4 py-6 sm:p-0 md:grid-cols-2 md:p-0 lg:grid-cols-3 lg:p-0 xl:p-0 2xl:p-0">
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${averageBaseRating}`}
							color="#f067e9"
							welcomeMessage={`Based on ${baseSongs.length} base plays`}
						/>
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${averageNewRating}`}
							color="#f067e9"
							welcomeMessage={`Based on ${newSongs.length} new plays`}
						/>
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${averageNextRating}`}
							color="#f067e9"
							welcomeMessage={`Based on ${newNextListCount} potential plays`}
						/>
					</div>
				) : (
					<div className="flex flex-col gap-4 py-6">
						<QouteCard
							icon={ChartNoAxesCombined}
							tagline=""
							value={`Average Rating: ${averageBaseRating}`}
							color="#f067e9"
							welcomeMessage={`Based on ${baseSongs.length} base plays`}
						/>
					</div>
				)}

				<div className="p-4 sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-0">
					{/* Highest Rating Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Highest Rating</h3>
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
						<div className="mt-6 mb-8 flex items-center justify-center space-x-4">
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

					{/* Recent Plays Table */}
					<h3 className="mb-4 text-xl font-semibold text-gray-100">Recent Plays</h3>
					<RatingFrameTable
						songs={paginatedHotSongs.map((song) => ({
							title: song.title,
							score: song.score,
							level: song.level,
							difficulty: getDifficultyFromChunithmChart(song.chartId),
							genre: song.genre,
							artist: song.artist,
							rating: song.rating,
							type: song.type,
						}))}
						searchQuery={searchHotQuery}
						onSearchChange={(e) => setSearchHotQuery(e.target.value)}
					/>
					{totalHotPages > 1 && (
						<div className="mt-6 mb-8 flex items-center justify-center space-x-4">
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

					{/* Current Version Table - Only show if version is 17 or higher */}
					{(version ?? 0) >= 17 && (
						<div className="space-y-4">
							<h3 className="mt-4 mb-4 text-xl font-semibold text-gray-100">Current Version</h3>
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
								<div className="mt-6 mb-8 flex items-center justify-center space-x-4">
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

					{/* Potential Plays Table - Only show if version is 17 or higher */}
					{(version ?? 0) >= 17 && (
						<>
							<h3 className="mb-4 text-xl font-semibold text-gray-100">Potential Plays</h3>
							<RatingFrameTable
								songs={paginatedNextSongs.map((song) => ({
									title: song.title,
									score: song.score,
									level: song.level,
									difficulty: getDifficultyFromChunithmChart(song.chartId),
									genre: song.genre,
									artist: song.artist,
									rating: song.rating,
									type: song.type,
								}))}
								searchQuery={searchNextQuery}
								onSearchChange={(e) => setSearchNextQuery(e.target.value)}
							/>
							{totalNextPages > 1 && (
								<div className="mt-6 mb-8 flex items-center justify-center space-x-4">
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
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChunithmRatingBaseList;
