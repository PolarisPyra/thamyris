import React, { useEffect, useState } from "react";

import { Music, Search, X } from "lucide-react";

import { useOngekiSongs } from "@/hooks/ongeki";
import { Song } from "@/types";

export interface SongPickerProps {
	onSelect: (song: Song) => void;
	open: boolean;
	onClose: () => void;
}

export const SongPicker = (props: SongPickerProps) => {
	const { onSelect, open, onClose } = props;
	const { data, isLoading } = useOngekiSongs();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<"title" | "level">("title");

	useEffect(() => {
		if (data) {
			let filtered = [...data];

			// Apply search filter
			if (searchTerm) {
				filtered = filtered.filter(
					(song) =>
						song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						song.artist.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}

			// Apply genre filter
			if (selectedGenre) {
				filtered = filtered.filter((song) => song.genre === selectedGenre);
			}

			// Apply sorting
			filtered.sort((a, b) => {
				if (sortBy === "title") {
					return a.title.localeCompare(b.title);
				} else {
					return b.level - a.level;
				}
			});

			setFilteredSongs(filtered);
		}
	}, [data, searchTerm, selectedGenre, sortBy]);

	const getUniqueGenres = () => {
		if (!data) return [];
		const genres = new Set(data.map((song) => song.genre));
		return Array.from(genres);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!open) return null;

	return (
		<div
			className="text-primary bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
			onKeyDown={handleKeyDown}
		>
			<div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800">
				{/* Header */}
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="flex items-center text-xl font-bold">
						<Music className="mr-2" size={20} />
						Select a Song
					</h2>
					<button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
						<X size={24} />
					</button>
				</div>

				{/* Search and filters */}
				<div className="grid grid-cols-1 gap-4 border-b p-4 md:grid-cols-3">
					<div className="relative col-span-1 md:col-span-2">
						<Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={18} />
						<input
							type="text"
							placeholder="Search by title or artist..."
							className="w-full rounded-lg border py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							autoFocus
						/>
					</div>

					<div className="flex gap-2">
						<select
							className="w-1/2 rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							value={selectedGenre || ""}
							onChange={(e) => setSelectedGenre(e.target.value || null)}
						>
							<option value="">All Genres</option>
							{getUniqueGenres().map((genre) => (
								<option key={genre} value={genre}>
									{genre}
								</option>
							))}
						</select>

						<select
							className="w-1/2 rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "title" | "level")}
						>
							<option value="title">Sort by: Name</option>
							<option value="level">Sort by: Level</option>
						</select>
					</div>
				</div>

				{/* Song list */}
				<div className="flex-1 overflow-y-auto p-4">
					{isLoading ? (
						<div className="flex h-64 items-center justify-center">
							<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
						</div>
					) : filteredSongs.length === 0 ? (
						<div className="py-12 text-center text-gray-500">No songs match your search</div>
					) : (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredSongs.map((song) => (
								<div
									key={song.id || song.songId}
									onClick={() => onSelect(song)}
									className="flex cursor-pointer flex-col rounded-lg border p-3 transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
								>
									<div className="truncate font-medium">{song.title}</div>
									<div className="truncate text-sm text-gray-500">{song.artist}</div>
									<div className="mt-2 flex justify-between text-sm">
										<span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">{song.genre}</span>
										<div className="flex items-center">
											<span className="mr-2">Lv.{song.level}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer with stats */}
				<div className="border-t p-3 text-sm text-gray-500">
					Showing {filteredSongs.length} of {data?.length || 0} songs
					{selectedGenre && ` • Filtered by: ${selectedGenre}`}
				</div>
			</div>
		</div>
	);
};
