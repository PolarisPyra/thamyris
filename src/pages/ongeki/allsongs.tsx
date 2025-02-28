import { useState } from "react";
import React from "react";

import { BoomBox } from "lucide-react";

import AllSongsTable from "@/components/common/allsongs-table";
import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import QouteCard from "@/components/common/qoutecard";
import { useUsername } from "@/hooks/common/use-username";
import { useOngekiSongs } from "@/hooks/ongeki/use-songs";
import { getDifficultyFromOngekiChart } from "@/utils/helpers";

const itemsPerPage = 10;

const OngekiAllSongs = () => {
	const { data: songs = [], isLoading } = useOngekiSongs();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoading || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="All Songs" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<div className="text-lg text-gray-400">Loading songs...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="All Songs" />
			<div className="container mx-auto space-y-6">
				{/* Quote Cards */}
				<div className="grid grid-cols-1 gap-4 p-4 py-6 sm:p-0 md:grid-cols-2 md:p-0 lg:grid-cols-3 lg:p-0 xl:p-0 2xl:p-0">
					<QouteCard
						icon={BoomBox}
						tagline=""
						value={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
						color="#f067e9"
						welcomeMessage="Explore all available songs"
					/>
				</div>

				{/* All songs table */}
				<div className="mb-4 p-4 sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-0">
					<h3 className="mt-4 mb-4 text-xl font-semibold text-gray-100">All Songs</h3>
					<AllSongsTable
						allsongs={paginatedSongs.map((song) => ({
							id: song.id,
							songId: song.songId,
							chartId: getDifficultyFromOngekiChart(song.chartId),
							title: (
								<div className="group relative flex items-center space-x-1">
									<span className="truncate">{song.title}</span>
								</div>
							),
							level: (
								<div className="flex flex-col items-start">
									<span>{song.level.toString()}</span>
									<span className="text-sm text-gray-400">{getDifficultyFromOngekiChart(song.chartId)}</span>
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

					{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
				</div>
			</div>
		</div>
	);
};

export default OngekiAllSongs;
