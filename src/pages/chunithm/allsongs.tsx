import { useState } from "react";
import React from "react";

import { Notebook } from "lucide-react";

import ChunithmAllSongsTable from "@/components/chunithm/allsongs-table";
import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import { useChunithmSongs } from "@/hooks/chunithm/use-songs";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { useUsername } from "@/hooks/users/use-username";

const ChunithmAllSongs = () => {
	const { data: songs = [], isLoading: isLoadingSongs } = useChunithmSongs();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();
	const { data: version } = useChunithmVersion();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSongs = songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()));

	if (isLoadingSongs || isLoadingUsername) {
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
					<div className="gap-4 p-4 py-6 sm:p-0">
						<QouteCard
							tagline=""
							value="View all songs"
							color="#ffaa00"
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							icon={Notebook}
						/>
					</div>

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
					<p className="text-gray-400">Please set your Chunithm version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default ChunithmAllSongs;
