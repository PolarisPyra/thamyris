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
		<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-100">Favorites</h2>
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
							<TableRow key={favorite.id} className="hover:bg-gray-700 border-b border-gray-700">
								<TableCell className="text-sm text-gray-300  max-w-[140px] truncate">
									{favorite.title}
								</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.chartId}</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.level}</TableCell>
								<TableCell className="text-sm text-gray-300">{favorite.genre}</TableCell>
								<TableCell className="text-sm text-gray-300 max-w-[140px] truncate">
									{favorite.artist}
								</TableCell>
								<TableCell className="text-sm text-gray-300 cursor-pointer">{favorite.icon}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default FavoritesTable;
