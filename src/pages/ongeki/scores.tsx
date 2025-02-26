import { useState } from "react";
import React from "react";

import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Trophy } from "lucide-react";

import Header from "@/components/common/header";
import QouteCard from "@/components/common/qoutecard";
import ScoreTable from "@/components/common/score-table";
import Spinner from "@/components/common/spinner";
import { useOngekiScores } from "@/hooks/chunithm/use-scores";
import { useUsername } from "@/hooks/common/use-username";
import {
	getDifficultyFromOngekiChart,
	getOngekiClearStatus,
	getOngekiComboStatus,
	getOngekiGrade,
} from "@/utils/helpers";

const ITEMS_PER_PAGE = 10;

const OngekiScorePage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: scores = [], isLoading: isLoadingScores } = useOngekiScores();
	const { data: username = "", isLoading: isLoadingUsername } = useUsername();

	const currentRating =
		scores?.length > 0 && scores[0]?.playerRating != null ? (scores[0].playerRating / 100).toFixed(2) : "0.00";

	const filteredScores = scores.filter((score) => score.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);
	const paginatedScores = filteredScores.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
			<main className="mx-auto h-[calc(100vh-64px)] max-w-full px-4 py-6 lg:px-8">
				<div className="flex flex-col gap-4">
					<div className="grid py-6">
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							tagline={`Rating: ${currentRating}`}
							value={""}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

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
								score: score.techScore.toLocaleString(),
								grade: getOngekiGrade(score.techScore),
								date: new Date(score.userPlayDate).toLocaleString(),
								level: (
									<div className="flex flex-col items-start">
										<span>{score.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyFromOngekiChart(score.chartId)}</span>
									</div>
								),
								lamp: getOngekiClearStatus(score.clearStatus),
								combolamp: getOngekiComboStatus(score.isFullCombo, score.isAllBreak, score.isFullBell),
								difficulty: getDifficultyFromOngekiChart(score.chartId),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="mb-4 flex items-center justify-center space-x-4">
						<button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => prev - 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Previous
						</button>
						<span className="text-sm text-gray-300">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default OngekiScorePage;
