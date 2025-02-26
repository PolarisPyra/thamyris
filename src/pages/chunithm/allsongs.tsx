import { useState } from "react";
import React from "react";

import { BoomBox } from "lucide-react";

import AllSongsTable from "@/components/common/allsongs-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import { useUsername } from "@/hooks/common/use-username";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

const ITEMS_PER_PAGE = 10;

const ChunithmAllSongs = () => {
	const { data: songs = [], isLoading } = useChunithmSongs();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	if (isLoading || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="All Songs" />
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
			<Header title="All Songs" />
			<main className="mx-auto h-[calc(100vh-64px)] max-w-full px-2 py-4 sm:px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid py-6">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={""}
							icon={BoomBox}
							color={"yellow"}
						/>
						<div className="mt-6 space-y-6"></div>

						<AllSongsTable
							allsongs={paginatedSongs.map((song) => ({
								id: song.id,
								songId: song.songId,
								chartId: getDifficultyFromChunithmChart(song.chartId),
								title: (
									<div className="group relative flex items-center space-x-1">
										<span className="">{song.title}</span>
									</div>
								),
								level: (
									<div className="flex flex-col items-start">
										<span>{song.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyFromChunithmChart(song.chartId)}</span>
									</div>
								),
								genre: song.genre,
								artist: (
									<div className="group relative flex max-w-[150px] items-center space-x-1">
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

					<div className="mb-4 flex items-center justify-center space-x-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Previous
						</button>
						<span className="text-sm text-gray-300">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
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
