import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { getDifficultyFromChartId } from "@/utils/helpers";
import { useUsername } from "@/hooks/common/use-username";
import {
	useUserRatingBaseBestList,
	useUserRatingBaseBestNewList,
	useUserRatingBaseHotList,
} from "@/hooks/ongeki/use-rating";
import RatingBaseBestListTable from "@/components/ongeki/rating-base-best-list-table";
const ITEMS_PER_PAGE = 15;

const OngekiRatingBaseList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentNewPage, setCurrentNewPage] = useState(1);
	const [currentHotPage, setCurrentHotPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchNewQuery, setSearchNewQuery] = useState("");
	const [searchHotQuery, setSearchHotQuery] = useState("");

	const { data: baseList = [], isLoading: isLoadingBaseList } = useUserRatingBaseBestList();
	const { data: newList = [], isLoading: isLoadingNewList } = useUserRatingBaseBestNewList();
	const { data: hotList = [], isLoading: isLoadingHotList } = useUserRatingBaseHotList();
	const { isLoading: isLoadingUsername } = useUsername();

	// Filter songs by search
	const filteredBaseSongs = baseList.filter((song) =>
		song.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredNewSongs = newList.filter((song) =>
		song.title.toLowerCase().includes(searchNewQuery.toLowerCase())
	);

	const filteredHotSongs = hotList.filter((song) =>
		song.title.toLowerCase().includes(searchHotQuery.toLowerCase())
	);

	const totalBaseRating = baseList.slice(0, 30).reduce((sum, song) => sum + song.rating, 0);
	const totalNewRating = newList.slice(0, 15).reduce((sum, song) => sum + song.rating, 0);
	const totalHotRating = hotList.slice(0, 10).reduce((sum, song) => sum + song.rating, 0);

	const totalSongs = baseList.length + newList.length + hotList.length;
	const averageRating = ((totalBaseRating + totalNewRating + totalHotRating) / 5500).toFixed(2);

	const totalBasePages = Math.ceil(filteredBaseSongs.length / ITEMS_PER_PAGE);
	const totalNewPages = Math.ceil(filteredNewSongs.length / ITEMS_PER_PAGE);
	const totalHotPages = Math.ceil(filteredHotSongs.length / ITEMS_PER_PAGE);

	const paginatedBaseSongs = filteredBaseSongs.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const paginatedNewSongs = filteredNewSongs.slice(
		(currentNewPage - 1) * ITEMS_PER_PAGE,
		currentNewPage * ITEMS_PER_PAGE
	);

	const paginatedHotSongs = filteredHotSongs.slice(
		(currentHotPage - 1) * ITEMS_PER_PAGE,
		currentHotPage * ITEMS_PER_PAGE
	);

	const formatSongs = (songs: typeof baseList) =>
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

	if (isLoadingBaseList || isLoadingNewList || isLoadingHotList || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Rating Frame" />
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
			<Header title="Rating Frame" />
			<div className="container mx-auto space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<QouteCard
						icon={Trophy}
						tagline="Base List"
						value={`Rating: ${averageRating}`}
						color="yellow"
						welcomeMessage={`Based on ${baseList.length} base plays, ${newList.length} new plays and ${hotList.length} hot plays for a total of ${totalSongs} plays`}
					/>
				</div>

				{/* Base List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Base List</h3>
					<RatingBaseBestListTable
						songs={formatSongs(paginatedBaseSongs)}
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
							Page {currentPage} of {Math.max(1, totalBasePages)}
						</span>
						<button
							disabled={currentPage === Math.max(1, totalBasePages)}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>

				{/* New List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">New List</h3>
					<RatingBaseBestListTable
						songs={formatSongs(paginatedNewSongs)}
						searchQuery={searchNewQuery}
						onSearchChange={(e) => setSearchNewQuery(e.target.value)}
					/>
					<div className="flex justify-center items-center space-x-4 mb-4">
						<button
							disabled={currentNewPage === 1}
							onClick={() => setCurrentNewPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentNewPage} of {Math.max(1, totalNewPages)}
						</span>
						<button
							disabled={currentNewPage === Math.max(1, totalNewPages)}
							onClick={() => setCurrentNewPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>

				{/* Hot List Table */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-100">Hot List</h3>
					<RatingBaseBestListTable
						songs={formatSongs(paginatedHotSongs)}
						searchQuery={searchHotQuery}
						onSearchChange={(e) => setSearchHotQuery(e.target.value)}
					/>
					<div className="flex justify-center items-center space-x-4 mb-4">
						<button
							disabled={currentHotPage === 1}
							onClick={() => setCurrentHotPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentHotPage} of {Math.max(1, totalHotPages)}
						</span>
						<button
							disabled={currentHotPage === Math.max(1, totalHotPages)}
							onClick={() => setCurrentHotPage((prev) => prev + 1)}
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

export default OngekiRatingBaseList;
