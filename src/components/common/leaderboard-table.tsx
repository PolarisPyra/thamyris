import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaderboardTableProps {
	players: {
		userId: number;
		username: string;
		rating: string;
	}[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	page: number;
	itemsPerPage: number;
}

export const LeaderboardTable = ({
	players,
	searchQuery,
	onSearchChange,
	page,
	itemsPerPage,
}: LeaderboardTableProps) => {
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg backdrop-blur-md sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-lg font-semibold text-gray-100 sm:text-xl">Leaderboard</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search players..."
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
							<TableHead className="text-gray-400">Rank</TableHead>
							<TableHead className="text-gray-400">Username</TableHead>
							<TableHead className="text-gray-400">Rating</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players.map((player, index) => (
							<TableRow key={player.userId} className="border-b border-gray-700 hover:bg-gray-700">
								<TableCell className="text-sm text-gray-300">#{(page - 1) * itemsPerPage + index + 1}</TableCell>
								<TableCell className="text-sm text-gray-300">{player.username}</TableCell>
								<TableCell className="text-sm text-gray-300">{player.rating}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
