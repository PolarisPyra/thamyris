import { useCallback, useState } from "react";
import React from "react";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import ChunithmFavoritesTable from "@/components/chunithm/favorites-table";
import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import {
	useAddFavorite,
	useChunithmSongs,
	useChunithmVersion,
	useFavorites,
	useRemoveFavorite,
} from "@/hooks/chunithm";
import { useCurrentUser } from "@/hooks/users";

const ChunithmFavorites = () => {
	const { username } = useCurrentUser();
	const { data: version } = useChunithmVersion();
	const { data: songs = [], isLoading: isLoadingSongs } = useChunithmSongs();
	const { data: favoriteSongIds = [], isLoading: isLoadingFavorites } = useFavorites();
	const { mutate: addFavorite } = useAddFavorite();
	const { mutate: removeFavorite } = useRemoveFavorite();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const handleToggleFavorite = useCallback(
		(songId: number) => {
			const isFavorited = favoriteSongIds.includes(songId);

			if (isFavorited) {
				removeFavorite(songId, {
					onSuccess: () => {
						toast.success("Removed from favorites");
					},
					onError: () => {
						toast.error("Failed to remove from favorites");
					},
				});
			} else {
				addFavorite(songId, {
					onSuccess: () => {
						toast.success("Added to favorites");
					},
					onError: () => {
						toast.error("Failed to add to favorites");
					},
				});
			}
		},
		[favoriteSongIds, addFavorite, removeFavorite]
	);

	const filteredSongs = songs
		.filter((song) => song.chartId === 3)
		.map((song) => ({
			...song,
			icon: (
				<Heart
					className={`h-5 w-5 cursor-pointer ${
						favoriteSongIds.includes(song.songId) ? "fill-current text-red-500" : "text-gray-500"
					}`}
					onClick={() => handleToggleFavorite(song.songId)}
				/>
			),
		}));

	const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoadingSongs || isLoadingFavorites) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Favorites" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<Spinner size={24} />
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Favorites" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							icon={Heart}
							tagline=""
							value={`Total Favorites: ${favoriteSongIds.length}`}
							color="#ffaa00"
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
						/>
					</div>

					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<ChunithmFavoritesTable
							favorites={paginatedSongs}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
						{totalPages > 1 && (
							<div className="mt-4 flex justify-center">
								<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<p className="text-primary">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmFavorites;
