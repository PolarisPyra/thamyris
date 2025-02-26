import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FavoritesTableProps {
	favorites: {
		id: number;
		songId: number;
		chartId: string;
		title: React.ReactNode;
		level: number | React.ReactNode;
		genre: string;
		artist: React.ReactNode;
		icon: React.ReactNode;
	}[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FavoritesTable = ({ favorites, searchQuery, onSearchChange }: FavoritesTableProps) => {
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg backdrop-blur-md sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-lg font-semibold text-gray-100 sm:text-xl">Favorites</h2>
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
							<TableHead>Song</TableHead>
							<TableHead>Difficulty</TableHead>
							<TableHead>Level</TableHead>
							<TableHead>Genre</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Favorite</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{favorites.map((favorite) => (
							<TableRow key={favorite.id} className="border-b border-gray-700 hover:bg-gray-700">
								<TableCell className="max-w-[140px] truncate text-sm text-gray-300">{favorite.title}</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.chartId}</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.level}</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.genre}</TableCell>
								<TableCell className="max-w-[140px] truncate text-sm text-gray-300">{favorite.artist}</TableCell>
								<TableCell className="cursor-pointer text-sm text-gray-300">{favorite.icon}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default FavoritesTable;
