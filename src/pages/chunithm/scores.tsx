import Header from "@/components/common/header";
import { useState } from "react";
import React from "react";
import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import ScoreTable from "@/components/common/score-table";
import {
	getChunithmClearStatus,
	getChunithmComboStatus,
	getDifficultyFromChartId,
	getGrade,
} from "@/utils/helpers";
import { useChunithmScores, useUsername } from "@/hooks/use-scores";
import Spinner from "@/components/common/spinner";

const ITEMS_PER_PAGE = 10;

const ChunithmScorePage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: scores = [], isLoading: isLoadingScores } = useChunithmScores();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const currentRating =
		scores?.length > 0 && scores[0]?.playerRating != null
			? (scores[0].playerRating / 100).toFixed(2)
			: "0.00";

	const totalRating = scores.reduce((sum, score) => sum + score.playerRating, 0);
	const averageRating = scores.length > 0 ? (totalRating / scores.length / 100).toFixed(2) : "0.00";

	const filteredScores = scores.filter((score) =>
		score.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);
	const paginatedScores = filteredScores.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	if (isLoadingScores || isLoadingUsername) {
		return (
			<div className="flex-1 overflow-auto relative">
				<Header title="Overview" />
				<div className="flex justify-center items-center h-[calc(100vh-64px)]">
					<div className="text-lg text-gray-400">
						<Spinner size={24} color="#ffffff" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="Overview" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-1 w-full">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={`Rating: ${currentRating}`}
							value={averageRating}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

						<ScoreTable
							scores={paginatedScores.map((score) => ({
								id: score.id,
								title: (
									<div className="flex items-center space-x-1 group relative">
										<span className="truncate">{score.title}</span>
									</div>
								),
								rating: (
									<div className="flex items-center">
										<span className="mr-4">{(score.playerRating / 100).toFixed(2)}</span>
										{score.rating_change === "Increase" && (
											<CircleArrowUp className="w-6 h-6 text-green-500" />
										)}
										{score.rating_change === "Decrease" && (
											<CircleArrowDown className="w-6 h-6 text-red-500" />
										)}
										{score.rating_change === "Same" && <CircleArrowRight className="w-6 h-6 text-gray-500" />}
									</div>
								),
								score: score.score.toLocaleString(),
								grade: getGrade(score.score),
								date: new Date(score.userPlayDate).toLocaleString(),
								level: (
									<div className="flex flex-col items-start">
										<span>{score.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyFromChartId(score.chartId)}</span>
									</div>
								),
								lamp: getChunithmClearStatus(score.isClear),
								combolamp: getChunithmComboStatus(score.isFullCombo, score.isAllJustice, score.score),
								difficulty: getDifficultyFromChartId(score.chartId),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex justify-center items-center space-x-4  mb-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Previous
						</button>
						<span className="text-gray-300 text-sm">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ChunithmScorePage;
