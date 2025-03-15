import React from "react";

import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OngekiScoreTableProps } from "@/types";
import { getDifficultyFromOngekiChart } from "@/utils/helpers";

const OngekiScoreTable = ({ scores, searchQuery, onSearchChange }: OngekiScoreTableProps) => {
	// Filter scores based on search query
	const filteredScores = scores.filter((score) => score.title.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div className="bg-card rounded-md p-4 sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-primary text-lg font-semibold sm:text-xl">Recent Scores</h2>
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
							<TableHead className="text-primary whitespace-nowrap">Song</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Score</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Rating</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Difficulty</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Playdate</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Level</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Combo Lamp</TableHead>
							<TableHead className="text-primary whitespace-nowrap">Clear Lamp</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredScores.map((score) => (
							<TableRow key={score.id} className="border-seperator hover:bg-hover border-b">
								<TableCell className="text-primary max-w-[140px] truncate text-sm font-medium">{score.title}</TableCell>
								<TableCell className="text-primary text-sm font-medium">{score.techScore.toLocaleString()}</TableCell>
								<TableCell className="text-primary text-sm">
									<div className="flex items-center">
										<span className="mr-4">{(score.playerRating / 100).toFixed(2)}</span>
										{score.rating_change === "Increase" && <CircleArrowUp className="h-6 w-6 text-green-500" />}
										{score.rating_change === "Decrease" && <CircleArrowDown className="h-6 w-6 text-red-500" />}
										{score.rating_change === "Same" && <CircleArrowRight className="h-6 w-6 text-gray-500" />}
									</div>
								</TableCell>
								<TableCell className="text-primary text-sm">{getDifficultyFromOngekiChart(score.chartId)}</TableCell>
								<TableCell className="text-primary text-sm">{new Date(score.userPlayDate).toLocaleString()}</TableCell>
								<TableCell className="text-primary text-sm">{score.level}</TableCell>

								<TableCell className="text-primary text-sm">
									{score.isFullCombo ? "FC" : ""} {score.isAllBreak ? "AB" : ""}
								</TableCell>
								<TableCell className="text-primary text-sm">
									{Number(score.clearStatus) === 2 ? "Win" : Number(score.clearStatus) === 1 ? "Draw" : "Loss"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{filteredScores.length === 0 && (
					<div className="text-primary py-8 text-center">
						<p>No scores found. Try a different search term.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default OngekiScoreTable;
