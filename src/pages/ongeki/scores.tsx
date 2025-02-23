import Header from "@/components/common/header";
import { api } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Trophy } from "lucide-react";
import QouteCard from "@/components/common/qoutecard";
import ScoreTable from "@/components/common/score-table";
import {
	getDifficultyClass,
	getOngekiClearStatus,
	getOngekiComboStatus,
	getOngekiGrade,
} from "@/utils/helpers";

interface OngekiApiResponse {
	results: Score[];
}

interface Score {
	id: number;
	maxCombo: number;
	isFullCombo: number;
	userPlayDate: string;
	playerRating: number;
	isAllBreak: number;
	isFullBell: number;
	techScore: number;
	battleScore: number;
	judgeMiss: number;
	judgeHit: number;
	judgeBreak: number;
	judgeCriticalBreak: number;
	clearStatus: number;
	cardId1: number;
	chartId: number;
	title: string;
	level: number;
	genre: string;
	artist: string;
	techscore_change: string;
	battlescore_change: string;
	rating_change: string;
}

const ITEMS_PER_PAGE = 10;

const OngekiScorePage = () => {
	const [playlogResponse, setResponse] = useState<Score[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [username, setUsername] = useState<string>("");
	const currentRating =
		playlogResponse.length > 0 ? (playlogResponse[0].playerRating / 100).toFixed(2) : "0.00";

	const search = playlogResponse.filter((response) =>
		response.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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

	const fetchScores = async () => {
		const response = await api.ongeki.ongeki_score_playlog.$get();
		if (response.ok) {
			const data: OngekiApiResponse = await response.json();
			const ongekiScorePlaylog = data.results.map((score) => ({
				id: score.id,
				maxCombo: score.maxCombo,
				isFullCombo: score.isFullCombo,
				userPlayDate: new Date(
					new Date(score.userPlayDate).getTime() - 9 * 60 * 60 * 1000
				).toISOString(), // Convert JST to UTC
				playerRating: Math.floor(score.playerRating),
				isAllBreak: score.isAllBreak,
				isFullBell: score.isFullBell,
				techScore: Math.floor(score.techScore),
				battleScore: Math.floor(score.battleScore),
				judgeMiss: score.judgeMiss,
				judgeHit: score.judgeHit,
				judgeBreak: score.judgeBreak,
				judgeCriticalBreak: score.judgeCriticalBreak,
				clearStatus: score.clearStatus,
				cardId1: score.cardId1,
				chartId: score.chartId,
				title: score.title,
				level: score.level,
				genre: score.genre,
				artist: score.artist,
				techscore_change: score.techscore_change,
				battlescore_change: score.battlescore_change,
				rating_change: score.rating_change,
			}));
			setResponse(ongekiScorePlaylog);
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
							name={` (Rating: ${currentRating})`}
							icon={Trophy}
							color={"#9e0bd9"}
						/>
						<div className="mt-6 space-y-6"></div>

						<ScoreTable
							scores={paginatedPlaylogScores.map((response) => ({
								id: response.id,
								title: (
									<div className="max-w-[150px] flex items-center space-x-1 group relative">
										<span className="truncate">{response.title}</span>
									</div>
								),
								score: response.techScore.toLocaleString(),
								grade: getOngekiGrade(response.techScore),
								date: new Date(response.userPlayDate).toLocaleString(),
								level: (
									<div className="flex flex-col items-start">
										<span>{response.level.toString()}</span>
										<span className="text-sm text-gray-400">{getDifficultyClass(response.chartId)}</span>
									</div>
								),
								difficulty: getDifficultyClass(response.chartId),
								lamp: getOngekiClearStatus(response.clearStatus),
								combolamp: getOngekiComboStatus(
									response.isFullCombo,
									response.isAllBreak,
									response.isFullBell
								),
								rating: (
									<div className="flex items-center">
										<span className="mr-4">{(response.playerRating / 100).toFixed(2)}</span>
										{response.rating_change === "Increase" && (
											<CircleArrowUp className="w-6 h-6 text-green-500" />
										)}
										{response.rating_change === "Decrease" && (
											<CircleArrowDown className="w-6 h-6 text-red-500" />
										)}
										{response.rating_change === "Same" && (
											<CircleArrowRight className="w-6 h-6 text-gray-500" />
										)}
									</div>
								),
							}))}
							searchQuery={searchQuery}
							onSearchChange={(e) => setSearchQuery(e.target.value)}
						/>
					</motion.div>

					<div className="flex justify-center items-center space-x-4 mb-4">
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

export default OngekiScorePage;
