import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cdnUrl } from "@/lib/constants";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

interface AllSongs {
	id?: number;
	title: React.ReactNode;
	chartId: number | null;
	level: number | React.ReactNode;
	genre: string | null;
	artist: React.ReactNode;
	jacketPath: string;
	icon?: React.ReactNode;
}

interface AllSongsTableProps {
	allSongs: AllSongs[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ChunithmAllSongsTable = ({ allSongs, searchQuery, onSearchChange }: AllSongsTableProps) => {
	const filteredSongs = allSongs.filter((song) => String(song.title).toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div className="bg-card rounded-md p-4 sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-primary text-lg font-semibold sm:text-xl">Favorites</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search songs..."
						className="bg-searchbar text-primary placeholder-primary focus:ring-primary w-full rounded-lg py-2 pr-4 pl-10 focus:outline-none"
						value={searchQuery}
						onChange={onSearchChange}
					/>
					<Search className="text-primary absolute top-2.5 left-3" size={18} />
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-seperator border-b hover:bg-transparent">
							<TableHead className="text-primary">Song</TableHead>
							<TableHead className="text-primary">Difficulty</TableHead>
							<TableHead className="text-primary">Level</TableHead>
							<TableHead className="text-primary">Genre</TableHead>
							<TableHead className="text-primary">Artist</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSongs.map((song) => (
							<TableRow key={song.id} className="border-seperator hover:bg-hover border-b">
								<TableCell className="text-primary text-sm">
									<div className="flex items-center gap-3">
										<img
											width={50}
											height={50}
											src={`${cdnUrl}assets/jacket/${song.jacketPath.replace(".dds", ".png")}`}
											alt={String(song.title)}
											className="flex-shrink-0"
										/>
										<span className="text-primary truncate">{song.title}</span>
									</div>
								</TableCell>
								<TableCell className="text-primary text-sm">{getDifficultyFromChunithmChart(song.chartId ?? 0)}</TableCell>
								<TableCell className="text-primary text-sm">{song.level}</TableCell>
								<TableCell className="text-primary text-sm">{song.genre}</TableCell>
								<TableCell className="text-primary max-w-[140px] truncate text-sm">{song.artist}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{filteredSongs.length === 0 && (
					<div className="text-primary py-8 text-center">
						<p>No songs found. Try a different search term.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChunithmAllSongsTable;
