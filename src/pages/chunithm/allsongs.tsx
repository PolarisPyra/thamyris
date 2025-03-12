import { useState } from "react";
import React from "react";

import ChunithmAllSongsTable from "@/components/chunithm/allsongs-table";
import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const ChunithmAllSongs = () => {
	const { data: songs = [], isLoading: isLoadingSongs } = useChunithmSongs();
	const { data: version } = useChunithmVersion();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));
	const ITEMS_PER_PAGE = 10;
	const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	if (isLoadingSongs) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="All Songs" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<Spinner size={24} />
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="All Songs" />
			{version ? (
				<div className="container mx-auto space-y-6">
					<div className="mb-4 space-y-8 p-4 sm:p-0">
						<ChunithmAllSongsTable
							allSongs={paginatedSongs}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
						{totalPages > 1 && (
							<div className="mb-4 flex items-center justify-center space-x-4">
								<button
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((prev) => prev - 1)}
									className="text-primary bg-button hover:bg-buttonhover cursor-pointer rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
								>
									Previous
								</button>
								<span className="text-primary text-sm">
									Page {currentPage} of {totalPages}
								</span>
								<button
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage((prev) => prev + 1)}
									className="text-primary bg-button hover:bg-buttonhover cursor-pointer rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
								>
									Next
								</button>
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

export default ChunithmAllSongs;
