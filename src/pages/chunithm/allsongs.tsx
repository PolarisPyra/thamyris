import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { getDifficultyFromChartId } from "@/utils/helpers";
import AllSongsTable from "@/components/common/allsongs-table";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import QouteCard from "@/components/common/qoutecard";
import { BoomBox } from "lucide-react";
import Spinner from "@/components/common/spinner";
import { useUsername } from "@/hooks/common/use-username";

const ITEMS_PER_PAGE = 10;

const ChunithmAllSongs = () => {
	const { data: songs = [], isLoading } = useChunithmSongs();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const filteredSongs = songs.filter((song) =>
		song.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	if (isLoading || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="All Songs" />
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
			<Header title="All Songs" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-4 px-2 sm:px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-1 w-full">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={""}
							icon={BoomBox}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

						<AllSongsTable
							allsongs={paginatedSongs.map((song) => ({
								id: song.id,
								songId: song.songId,
								chartId: getDifficultyFromChartId(song.chartId),
								title: (
									<div className="flex items-center space-x-1 group relative">
										<span className="">{song.title}</span>
									</div>
								),
								level: (
									<div className="flex flex-col items-start">
										<span>{song.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyFromChartId(song.chartId)}</span>
									</div>
								),
								genre: song.genre,
								artist: (
									<div className="max-w-[150px] flex items-center space-x-1 group relative">
										<span className="truncate">{song.artist}</span>
									</div>
								),
								jacketPath: song.jacketPath,
								icon: null,
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex justify-center items-center space-x-4 mb-4">
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

export default ChunithmAllSongs;
