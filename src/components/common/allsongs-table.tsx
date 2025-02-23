import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import React from "react";

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
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-100">All Songs</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search songs..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
						value={searchQuery}
						onChange={onSearchChange}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
							<TableRow key={songs.id} className="hover:bg-gray-700 border-b border-gray-700">
								<TableCell className="text-sm text-gray-300">{songs.title}</TableCell>
								<TableCell className="text-sm text-gray-300">{songs.level}</TableCell>
								<TableCell className="text-sm text-gray-300">{songs.genre}</TableCell>
								<TableCell className="text-sm text-gray-300 ">{songs.artist}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default AllSongsTable;
