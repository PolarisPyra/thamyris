import { useState } from "react";
import React from "react";

import { Notebook } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import Spinner from "@/components/common/spinner";
import OngekiAllSongsTable from "@/components/ongeki/allsongs-table";
import { useOngekiSongs } from "@/hooks/ongeki/use-songs";
import { useOngekiVersion } from "@/hooks/ongeki/use-version";
import { useUsername } from "@/hooks/users/use-username";

const OngekiAllSongs = () => {
	const { data: songs = [], isLoading: isLoadingSongs } = useOngekiSongs();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();
	const { data: version } = useOngekiVersion();
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
							color="#f067e9"
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							icon={Notebook}
						/>
					</div>

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
					<p className="text-gray-400">Please set your Ongeki version in settings first</p>
				</div>
			)}
		</div>
	);
};

export default OngekiAllSongs;
