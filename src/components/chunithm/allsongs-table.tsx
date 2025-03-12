import React, { useState } from "react";

import { Search } from "lucide-react";

import Pagination from "@/components/common/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AllSongsTableProps } from "@/types/types";
import { getDifficultyFromChunithmChart } from "@/utils/helpers";

const ChunithmAllSongsTable = ({ allSongs, searchQuery, onSearchChange }: AllSongsTableProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	const filteredSongs = allSongs.filter((song) => String(song.title).toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
	const paginatedSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
						{paginatedSongs.map((favorite) => (
							<TableRow key={favorite.id} className="border-seperator hover:bg-hover border-b">
								<TableCell className="text-primary max-w-[140px] truncate text-sm">{favorite.title}</TableCell>
								<TableCell className="text-primary text-sm">{getDifficultyFromChunithmChart(favorite.chartId)}</TableCell>
								<TableCell className="text-primary text-sm">{favorite.level}</TableCell>
								<TableCell className="text-primary text-sm">{favorite.genre}</TableCell>
								<TableCell className="text-primary max-w-[140px] truncate text-sm">{favorite.artist}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{paginatedSongs.length === 0 && (
					<div className="text-primary py-8 text-center">
						<p>No songs found. Try a different search term.</p>
					</div>
				)}
			</div>

			{totalPages > 1 && (
				<div className="mt-4 flex justify-center">
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</div>
			)}
		</div>
	);
};

export default ChunithmAllSongsTable;
