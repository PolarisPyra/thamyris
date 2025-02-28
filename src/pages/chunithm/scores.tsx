import { useState } from "react";
import React from "react";

import { ChartNoAxesCombined, CircleArrowDown, CircleArrowRight, CircleArrowUp } from "lucide-react";

import Header from "@/components/common/header";
import Pagination from "@/components/common/pagination";
import QouteCard from "@/components/common/qoutecard";
import ScoreTable from "@/components/common/score-table";
import Spinner from "@/components/common/spinner";
// Import the Pagination component
import { useChunithmScores } from "@/hooks/chunithm/use-scores";
import { useUsername } from "@/hooks/common/use-username";
import {
	getChunithmClearStatus,
	getChunithmComboStatus,
	getDifficultyFromChunithmChart,
	getGrade,
} from "@/utils/helpers";

const itemsPerPage = 10;

const ChunithmScorePage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: scores = [], isLoading: isLoadingScores } = useChunithmScores();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const currentRating =
		scores?.length > 0 && scores[0]?.playerRating != null ? (scores[0].playerRating / 100).toFixed(2) : "0.00";

	const filteredScores = scores.filter((score) => score.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredScores.length / itemsPerPage);
	const paginatedScores = filteredScores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoadingScores || isLoadingUsername) {
		return (
			<div className="relative flex-1 overflow-auto">
				<Header title="Overview" />
				<div className="flex h-[calc(100vh-64px)] items-center justify-center">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title="Overview" />
			<div className="container mx-auto space-y-6">
				{/* Quote Cards */}
				<div className="grid grid-cols-1 gap-4 p-4 py-6 sm:p-0 md:grid-cols-2 md:p-0 lg:grid-cols-3 lg:p-0 xl:p-0 2xl:p-0">
					<QouteCard
						icon={ChartNoAxesCombined}
						tagline={`Rating: ${currentRating}`}
						value={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
						color="yellow"
						welcomeMessage="Your recent scores and performance"
					/>
				</div>

				{/* Scores table */}
				<div className="mb-4 p-4 sm:p-0 md:p-0 lg:p-0 xl:p-0 2xl:p-0">
					<h3 className="mt-4 mb-4 text-xl font-semibold text-gray-100">Recent Scores</h3>
					<ScoreTable
						scores={paginatedScores.map((score) => ({
							id: score.id,
							title: (
								<div className="group relative flex items-center space-x-1">
									<span className="truncate">{score.title}</span>
								</div>
							),
							rating: (
								<div className="flex items-center">
									<span className="mr-4">{(score.playerRating / 100).toFixed(2)}</span>
									{score.rating_change === "Increase" && <CircleArrowUp className="h-6 w-6 text-green-500" />}
									{score.rating_change === "Decrease" && <CircleArrowDown className="h-6 w-6 text-red-500" />}
									{score.rating_change === "Same" && <CircleArrowRight className="h-6 w-6 text-gray-500" />}
								</div>
							),
							score: score.score.toLocaleString(),
							grade: getGrade(score.score),
							date: new Date(score.userPlayDate).toLocaleString(),
							level: (
								<div className="flex flex-col items-start">
									<span>{score.level.toString()}</span>
									<span className="text-sm text-gray-400">{getDifficultyFromChunithmChart(score.chartId)}</span>
								</div>
							),
							lamp: getChunithmClearStatus(score.isClear),
							combolamp: getChunithmComboStatus(score.isFullCombo, score.isAllJustice, score.score),
							difficulty: getDifficultyFromChunithmChart(score.chartId),
						}))}
						searchQuery={searchQuery}
						onSearchChange={(e) => setSearchQuery(e.target.value)}
					/>

					{totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
				</div>
			</div>
		</div>
	);
};

export default ChunithmScorePage;
