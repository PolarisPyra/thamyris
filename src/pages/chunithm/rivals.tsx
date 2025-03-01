import { useState } from "react";
import React from "react";

import { Heart, HeartIcon } from "lucide-react";
import { toast } from "sonner";

import FavoritesTable from "@/components/common/favorites-table";
import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
// Import the Pagination component
import { useAddFavorite, useFavorites, useRemoveFavorite } from "@/hooks/chunithm/use-favorites";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import { useUsername } from "@/hooks/common/use-username";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

const itemsPerPage = 10;

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

	const totalPages = Math.ceil(filter.length / itemsPerPage);
	const paginatedSongs = filter.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoadingSongs || isLoadingFavorites || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Overview" />
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
			<Header title="Overview" />
			<div className="container mx-auto space-y-6">
				{/* Quote Cards */}
				<div className="gap-4 p-4 py-6 sm:p-0 md:grid-cols-2 md:p-0 lg:grid-cols-3 lg:p-0 xl:p-0 2xl:p-0">
					<QouteCard
						icon={Heart}
						tagline={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
						value=""
						color="yellow"
						welcomeMessage="Rival your friends!"
					/>
				</div>

				{/* Favorites table */}
				<div className="mb-4 p-4 sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-0">
					<h3 className="mt-4 mb-4 text-xl font-semibold text-gray-100">Favorites</h3>
					<FavoritesTable
						favorites={paginatedSongs.map((song) => ({
							id: song.id,
							songId: song.songId,
							chartId: getDifficultyFromChunithmChart(song.chartId),
							title: (
								<div className="group relative flex items-center space-x-1">
									<span className="truncate">{song.title}</span>
								</div>
							),
							level: song.level,
							genre: song.genre,
							jacketPath: song.jacketPath,
							artist: song.artist,
							icon: (
								<HeartIcon
									className={`h-8 w-8 cursor-pointer ${
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

					{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
				</div>
			</div>
		</div>
	);
};

export default ChunithmFavorites;
