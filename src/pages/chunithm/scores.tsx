import Header from "@/components/common/header";
import { api } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import ScoreTable from "@/components/common/score-table";
import {
	getChunithmClearStatus,
	getChunithmComboStatus,
	getDifficultyClass,
	getGrade,
} from "@/utils/helpers";

interface ChunithmApiResponse {
	results: Score[];
}

interface Score {
	id: number;
	maxCombo: number;
	isFullCombo: number;
	userPlayDate: string;
	playerRating: number;
	isAllJustice: number;
	score: number;
	judgeHeaven: number;
	judgeGuilty: number;
	judgeJustice: number;
	judgeAttack: number;
	judgeCritical: number;
	isClear: number;
	skillId: number;
	isNewRecord: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	jacketPath: string;
	artist: string;
	score_change: string;
	rating_change: string;
	rating: number;
}

const ITEMS_PER_PAGE = 10;

const ChunithmScorePage = () => {
	const [playlogResponse, setResponse] = useState<Score[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [username, setUsername] = useState<string>("");

	const fetchUsername = async () => {
		try {
			const response = await api.users.username.$get();
			if (response.ok) {
				const data = await response.json();
				return data.username;
			}
			throw new Error("Failed to fetch username");
		} catch (error) {
			console.error("Error fetching username:", error);
			return null;
		}
	};

	useEffect(() => {
		const getUsername = async () => {
			const name = await fetchUsername();
			if (name) {
				setUsername(name);
			}
		};
		getUsername();
	}, []);

	const currentRating =
		playlogResponse.length > 0 ? (playlogResponse[1].playerRating / 100).toFixed(2) : "0.00";

	const search = playlogResponse.filter((response) =>
		response.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const fetchScores = async () => {
		const response = await api.chunithm.chuni_score_playlog.$get();
		if (response.ok) {
			const data: ChunithmApiResponse = await response.json();
			const chuniScorePlaylog = data.results.map((score) => ({
				id: score.id,
				maxCombo: score.maxCombo,
				isFullCombo: score.isFullCombo,
				userPlayDate: new Date(
					new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000
				).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				isAllJustice: score.isAllJustice,
				score: Math.floor(score.score),
				judgeHeaven: score.judgeHeaven,
				judgeGuilty: score.judgeGuilty,
				judgeJustice: score.judgeJustice,
				judgeAttack: score.judgeAttack,
				judgeCritical: score.judgeCritical,
				isClear: score.isClear,
				skillId: score.skillId,
				isNewRecord: score.isNewRecord,
				chartId: score.chartId,
				title: score.title,
				level: score.level,
				genre: score.genre,
				jacketPath: score.jacketPath,
				artist: score.artist,
				score_change: score.score_change,
				rating_change: score.rating_change,
				rating: score.rating,
			}));
			setResponse(chuniScorePlaylog);
		}
	};

	useEffect(() => {
		fetchScores();
	}, []);

	const totalPages = Math.ceil(search.length / ITEMS_PER_PAGE);
	const paginatedPlaylogScores = search.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title="Overview" />
			<main className="max-w-full mx-auto h-[calc(100vh-64px)] py-6 px-4 lg:px-8">
				<div className="flex flex-col gap-4">
					<motion.div
						className="grid grid-cols-1 w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<QouteCard
							welcomeMessage={`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}`}
							name={`(Rating: ${currentRating})`}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

						<ScoreTable
							scores={paginatedPlaylogScores.map((scores) => ({
								id: scores.id,
								title: (
									<div className="max-w-[150px] flex items-center space-x-1 group relative">
										<span className="truncate">{scores.title}</span>
									</div>
								),
								rating: (
									<div className="flex items-center">
										<span className="mr-4">{(scores.playerRating / 100).toFixed(2)}</span>
										{scores.rating_change === "Increase" && (
											<CircleArrowUp className="w-6 h-6 text-green-500" />
										)}
										{scores.rating_change === "Decrease" && (
											<CircleArrowDown className="w-6 h-6 text-red-500" />
										)}
										{scores.rating_change === "Same" && (
											<CircleArrowRight className="w-6 h-6 text-gray-500" />
										)}
									</div>
								),
								score: scores.score.toLocaleString(),
								grade: getGrade(scores.score),
								date: new Date(scores.userPlayDate).toLocaleString(),
								level: (
									<div className="flex flex-col items-start">
										<span>{scores.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyClass(scores.chartId)}</span>
									</div>
								),
								lamp: getChunithmClearStatus(scores.isClear),
								combolamp: getChunithmComboStatus(scores.isFullCombo, scores.isAllJustice, scores.score),
								difficulty: getDifficultyClass(scores.chartId),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>

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
