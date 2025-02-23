import Header from "@/components/common/header";
import { api } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { HeartIcon, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import { getDifficultyClass } from "@/utils/helpers";
import FavoritesTable from "@/components/common/favorites-table";
interface ChunithmApiResponse {
	results: Favorites[];
}

interface Favorites {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	jacketPath: string;
	artist: string;
	isFavorite?: boolean; // Add this field
}

const ITEMS_PER_PAGE = 10;

const ChunithmFavorites = () => {
	const [playlogResponse, setResponse] = useState<Favorites[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [favoriteSongIds, setFavoriteSongIds] = useState<number[]>([]);

	const fetchFavorites = async () => {
		try {
			const response = await api.chunithm.favorites.all.$get();
			if (response.ok) {
				const data = await response.json();
				setFavoriteSongIds(data.results.map((fav: { favId: number }) => fav.favId));
			}
		} catch (error) {
			console.error("Error fetching favorites:", error);
		}
	};

	const handleAddFavorite = async (songId: number) => {
		try {
			const response = await api.chunithm.favorites.add.$post({
				json: { favId: songId },
			});

			if (response.ok) {
				console.log("Favorite added successfully");
			} else {
				console.error("Failed to add favorite");
			}
		} catch (error) {
			console.error("Error adding favorite:", error);
		}
	};

	const handleRemoveFavorite = async (songId: number) => {
		try {
			const response = await api.chunithm.favorites.remove.$post({
				json: { favId: songId },
			});
			if (response.ok) {
				console.log("Favorite removed successfully");
			} else {
				console.error("Failed to remove favorite");
			}
		} catch (error) {
			console.error("Error removing favorite:", error);
		}
	};

	const filter = playlogResponse
		.filter((response) => response.chartId === 3)
		.filter((response) => response.title.toLowerCase().includes(searchQuery.toLowerCase()));
	const fetchScores = async () => {
		const resp = await api.chunithm.chuni_static_music.$get();
		if (resp.ok) {
			const data: ChunithmApiResponse = await resp.json();
			const chuniScorePlaylog = data.results.map((response) => ({
				id: response.id,
				songId: response.songId,
				chartId: response.chartId,
				title: response.title,
				level: response.level,
				genre: response.genre,
				jacketPath: response.jacketPath,
				artist: response.artist,
			}));
			setResponse(chuniScorePlaylog);
		}
	};
	useEffect(() => {
		fetchScores();
		fetchFavorites();
	}, []);

	const totalPages = Math.ceil(filter.length / ITEMS_PER_PAGE);
	const paginatedPlaylogScores = filter.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="Overview" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<motion.div
						className="grid grid-cols-1 w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<QouteCard
							welcomeMessage="Welcome back,"
							name={"PolarisPyra"}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

						<FavoritesTable
							favorites={paginatedPlaylogScores.map((songs) => ({
								id: songs.id,
								songId: songs.songId,
								chartId: getDifficultyClass(Number(songs.chartId)),
								title: (
									<div className="`max-w-[200px] `flex items-center space-x-1 group relative">
										<span className="truncate">{songs.title}</span>
									</div>
								),
								level: songs.level,
								genre: songs.genre,
								jacketPath: songs.jacketPath,
								artist: songs.artist,
								icon: (
									<HeartIcon
										className={`w-8 h-8 ${
											favoriteSongIds.includes(songs.songId) ? "text-red-500" : "text-gray-500"
										}`}
										onClick={() => {
											const isFavorited = favoriteSongIds.includes(songs.songId);
											if (isFavorited) {
												handleRemoveFavorite(songs.songId);
												setFavoriteSongIds((previousFavorites) =>
													previousFavorites.filter((favoriteId) => favoriteId !== songs.songId)
												);
											} else {
												handleAddFavorite(songs.songId);
												setFavoriteSongIds((previousFavorites) => [...previousFavorites, songs.songId]);
											}
										}}
									/>
								),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>

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
