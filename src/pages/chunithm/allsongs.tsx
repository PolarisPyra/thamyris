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

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
							allSongs={filteredSongs}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
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
