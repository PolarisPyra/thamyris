import { useState } from "react";
import React from "react";

import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import OngekiAllSongsTable from "@/components/ongeki/allsongs-table";
import { useOngekiSongs } from "@/hooks/ongeki/use-songs";
import { useOngekiVersion } from "@/hooks/ongeki/use-version";

const OngekiAllSongs = () => {
	const { data: songs = [], isLoading: isLoadingSongs } = useOngekiSongs();
	const { data: version } = useOngekiVersion();
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
						<OngekiAllSongsTable
							allSongs={filteredSongs}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
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
