import { useState } from "react";
import React from "react";

import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import Spinner from "@/components/common/spinner";
import OngekiAllSongsTable from "@/components/ongeki/allsongs-table";
import { useOngekiSongs, useOngekiVersion } from "@/hooks/ongeki";

const OngekiAllSongs = () => {
	const version = useOngekiVersion();

	const { data: songs = [], isLoading: isLoadingSongs } = useOngekiSongs();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));
	const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
						<OngekiAllSongsTable
							allSongs={paginatedSongs}
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
					<p className="text-primary">Please set your Ongeki version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default OngekiAllSongs;
