import React, { useState } from "react";

import { Search } from "lucide-react";

import Pagination from "@/components/common/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OngekiScoreTableProps } from "@/utils/types";

const OngekiScoreTable = ({ scores, searchQuery, onSearchChange }: OngekiScoreTableProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;

	const filteredScores = scores.filter((score) => score.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredScores.length / itemsPerPage);
	const paginatedScores = filteredScores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg backdrop-blur-md sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-lg font-semibold text-gray-100 sm:text-xl">Recent Scores</h2>
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
							<TableHead className="whitespace-nowrap text-gray-400">Song</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Score</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Rating</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Grade</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Playdate</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Level</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Combo Lamp</TableHead>
							<TableHead className="whitespace-nowrap text-gray-400">Clear Lamp</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedScores.map((score) => (
							<TableRow key={score.id} className="border-b border-gray-700 hover:bg-gray-700/50">
								<TableCell className="max-w-[140px] truncate text-sm font-medium text-gray-200">{score.title}</TableCell>
								<TableCell className="text-sm font-medium text-gray-300">{score.techScore.toLocaleString()}</TableCell>
								<TableCell className="text-sm text-gray-300">{(score.playerRating / 100).toFixed(2)}</TableCell>
								<TableCell className="text-sm text-gray-300">{score.clearStatus}</TableCell>
								<TableCell className="text-sm text-gray-300">{new Date(score.userPlayDate).toLocaleString()}</TableCell>
								<TableCell className="text-sm text-gray-300">{score.level}</TableCell>
								<TableCell className="text-sm text-gray-300">
									{score.isFullCombo ? "FC" : ""} {score.isAllBreak ? "AB" : ""}
								</TableCell>
								<TableCell className="text-sm text-gray-300">
									{Number(score.clearStatus) === 2 ? "Win" : Number(score.clearStatus) === 1 ? "Draw" : "Loss"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<div className="mt-6 flex justify-center">
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
				</div>
			)}
		</div>
	);
};

export default OngekiScoreTable;
