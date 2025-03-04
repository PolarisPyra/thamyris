import { useCallback, useState } from "react";
import React from "react";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import ChunithmFavoritesTable from "@/components/chunithm/favorites-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { useAddFavorite, useFavorites, useRemoveFavorite } from "@/hooks/chunithm/use-favorites";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import { useUsername } from "@/hooks/common/use-username";

const ChunithmFavorites = () => {
	const { data: songs = [], isLoading: isLoadingSongs } = useChunithmSongs();
	const { data: favoriteSongIds = [], isLoading: isLoadingFavorites } = useFavorites();
	const { mutate: addFavorite } = useAddFavorite();
	const { mutate: removeFavorite } = useRemoveFavorite();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();
	const [searchQuery, setSearchQuery] = useState("");

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

	if (isLoadingSongs || isLoadingFavorites || isLoadingUsername) {
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
						favorites={filteredSongs}
						searchQuery={searchQuery}
						onSearchChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChunithmFavorites;
