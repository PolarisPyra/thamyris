import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AllSongsTableProp {
	allsongs: {
		id: number;
		songId: number;
		chartId: string;
		title: string | React.ReactNode;
		level: number | React.ReactNode;
		genre: string;
		jacketPath: string;
		artist: string | React.ReactNode;
		icon?: React.ReactNode;
	}[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AllSongsTable = ({ allsongs, searchQuery, onSearchChange }: AllSongsTableProp) => {
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg backdrop-blur-md sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-lg font-semibold text-gray-100 sm:text-xl">All Songs</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search songs..."
						className="w-full rounded-lg bg-gray-700 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						value={searchQuery}
						onChange={onSearchChange}
					/>
					<Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
				</div>
			</div>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-gray-400">Song</TableHead>
							<TableHead className="text-gray-400">Level</TableHead>
							<TableHead className="text-gray-400">Genre</TableHead>
							<TableHead className="text-gray-400">Artist</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allsongs.map((songs) => (
							<TableRow key={songs.id} className="border-b border-gray-700 hover:bg-gray-700">
								<TableCell className="text-sm text-gray-300">{songs.title}</TableCell>
								<TableCell className="text-sm text-gray-300">{songs.level}</TableCell>
								<TableCell className="text-sm text-gray-300">{songs.genre}</TableCell>
								<TableCell className="text-sm text-gray-300">{songs.artist}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default AllSongsTable;
