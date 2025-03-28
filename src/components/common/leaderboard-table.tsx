import React from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaderboardTable {
	user: number;
	userName: string | null;
	playerRating: number | null;
}

interface LeaderboardTableProps {
	players: LeaderboardTable[];

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
	const sortedPlayers = [...players].sort((a, b) => b.playerRating! - a.playerRating!);

	return (
		<div className="bg-card rounded-md p-4 sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-primary text-lg font-semibold sm:text-xl">Leaderboard</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search players..."
						className="bg-searchbar text-primary placeholder-primary focus:ring-primary w-full rounded-lg py-2 pr-4 pl-10 focus:ring-0 focus:outline-none"
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
							<TableHead className="text-primary">Rank</TableHead>
							<TableHead className="text-primary">Username</TableHead>
							<TableHead className="text-primary">Rating</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedPlayers.map((player, index) => {
							const rank = (page - 1) * itemsPerPage + index + 1;
							let rowClass = "border-b border-seperator ";

							if (rank === 1) {
								rowClass += "bg-yellow-300/20 hover:bg-amber-300/30";
							} else if (rank === 2) {
								rowClass += "bg-teal-500/20 hover:bg-teal-500/30";
							} else {
								rowClass += "hover:bg-hover";
							}

							return (
								<TableRow key={player.user} className={rowClass}>
									<TableCell className="text-primary text-sm">#{rank}</TableCell>
									<TableCell className="text-primary text-sm">{player.userName}</TableCell>
									<TableCell className="text-primary text-sm">{(Number(player.playerRating) / 100).toFixed(2)}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
