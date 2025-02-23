import Header from "@/components/common/header";
import { api } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { getDifficultyClass } from "@/utils/helpers";

import AllSongsTable from "@/components/common/allsongs-table";

interface Song {
	id: number;
	songId: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	artist: string;
	jacketPath: string;
}

const ITEMS_PER_PAGE = 10;

const ChunithmAllSongs = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSongs = songs.filter((song) =>
		song.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);
	const fetchSongs = async () => {
		const resp = await api.chunithm.chuni_static_music.$get();
		if (resp.ok) {
			const data = await resp.json();
			setSongs(data.results);
		}
	};

	useEffect(() => {
		fetchSongs();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="All Songs" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-4 px-2 sm:px-4 lg:px-8">
				{" "}
				<div className="flex flex-col gap-4">
					<motion.div
						className="grid grid-cols-1 w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<AllSongsTable
							allsongs={paginatedSongs.map((songs) => ({
								id: songs.id,
								songId: songs.songId,
								chartId: getDifficultyClass(songs.chartId),
								title: (
									<div className="flex items-center space-x-1 group relative">
										<span className="">{songs.title}</span>
									</div>
								),
								level: (
									<div className="flex flex-col items-start">
										<span>{songs.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyClass(songs.chartId)}</span>
									</div>
								),
								genre: songs.genre,
								artist: (
									<div className="max-w-[150px] flex items-center space-x-1 group relative">
										<span className="truncate">{songs.artist}</span>
									</div>
								),
								jacketPath: songs.jacketPath,
								icon: null,
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>

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
