import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { Heart, HeartIcon } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import { getDifficultyFromChartId } from "@/utils/helpers";
import FavoritesTable from "@/components/common/favorites-table";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/chunithm/use-favorites";
import { toast } from "sonner";
import Spinner from "@/components/common/spinner";
import { useUsername } from "@/hooks/common/use-username";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";

const ITEMS_PER_PAGE = 10;

const ChunithmFavorites = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: songs = [], isLoading: isLoadingSongs } = useChunithmSongs();
	const { data: favoriteSongIds = [], isLoading: isLoadingFavorites } = useFavorites();
	const { mutate: addFavorite } = useAddFavorite();
	const { mutate: removeFavorite } = useRemoveFavorite();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const filter = songs
		.filter((song) => song.chartId === 3)
		.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filter.length / ITEMS_PER_PAGE);
	const paginatedSongs = filter.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	if (isLoadingSongs || isLoadingFavorites || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Overview" />
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
			<Header title="Overview" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-1 w-full">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={""}
							icon={Heart}
							color={"yellow"}
						/>
						<div className="mt-6 space-y-6"></div>

						<FavoritesTable
							favorites={paginatedSongs.map((song) => ({
								id: song.id,
								songId: song.songId,
								chartId: getDifficultyFromChartId(song.chartId),
								title: (
									<div className="`max-w-[200px] `flex items-center space-x-1 group relative">
										<span className="truncate">{song.title}</span>
									</div>
								),
								level: song.level,
								genre: song.genre,
								jacketPath: song.jacketPath,
								artist: song.artist,
								icon: (
									<HeartIcon
										className={`w-8 h-8 ${
											favoriteSongIds.includes(song.songId) ? "text-red-500" : "text-gray-500"
										}`}
										onClick={() => {
											const isFavorited = favoriteSongIds.includes(song.songId);
											if (isFavorited) {
												removeFavorite(song.songId, {
													onSuccess: () => {
														toast.success("Removed from favorites");
													},
													onError: () => {
														toast.error("Failed to remove from favorites");
													},
												});
											} else {
												addFavorite(song.songId, {
													onSuccess: () => {
														toast.success("Added to favorites");
													},
													onError: () => {
														toast.error("Failed to add to favorites");
													},
												});
											}
										}}
									/>
								),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex justify-center items-center space-x-4  mb-4">
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
				</div>
			</main>
		</div>
	);
};

export default ChunithmFavorites;
