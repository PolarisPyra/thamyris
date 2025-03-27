import React from "react";

import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDifficultyFromOngekiChart, getOngekiGrade } from "@/utils/helpers";

interface OngekiScore {
	id: number;
	user: number;
	sortNumber: number | null;
	placeId: number | null;
	placeName: string | null;
	playDate: string | null;
	userPlayDate: string | null;
	musicId: number | null;
	level: number | null;
	playKind: number | null;
	eventId: number | null;
	eventName: string | null;
	eventPoint: number | null;
	playedUserId1: number | null;
	playedUserId2: number | null;
	playedUserId3: number | null;
	playedUserName1: string | null;
	playedUserName2: string | null;
	playedUserName3: string | null;
	playedMusicLevel1: number | null;
	playedMusicLevel2: number | null;
	playedMusicLevel3: number | null;
	cardId1: number | null;
	cardId2: number | null;
	cardId3: number | null;
	cardLevel1: number | null;
	cardLevel2: number | null;
	cardLevel3: number | null;
	cardAttack1: number | null;
	cardAttack2: number | null;
	cardAttack3: number | null;
	bossCharaId: number | null;
	bossLevel: number | null;
	bossAttribute: number | null;
	clearStatus: number | null;
	techScore: number | null;
	techScoreRank: number | null;
	battleScore: number | null;
	battleScoreRank: number | null;
	maxCombo: number | null;
	judgeMiss: number | null;
	judgeHit: number | null;
	judgeBreak: number | null;
	judgeCriticalBreak: number | null;
	rateTap: number | null;
	rateHold: number | null;
	rateFlick: number | null;
	rateSideTap: number | null;
	rateSideHold: number | null;
	bellCount: number | null;
	totalBellCount: number | null;
	damageCount: number | null;
	overDamage: number | null;
	isTechNewRecord: boolean | null;
	isBattleNewRecord: boolean | null;
	isOverDamageNewRecord: boolean | null;
	isFullCombo?: number | undefined;
	isFullBell?: number;
	isAllBreak?: number;
	playerRating: number | null;
	battlePoint: number | null;
	platinumScore: number | null;
	platinumScoreMax: number | null;
	title?: string;
	chartId?: number;
	rating_change?: "Increase" | "Decrease" | "Same";
}

interface OngekiScoreTableProps {
	scores: OngekiScore[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OngekiScoreTableNew = ({ scores, searchQuery, onSearchChange }: OngekiScoreTableProps) => {
	// Filter scores based on search query
	const filteredScores = scores.filter((score) => score.title?.toLowerCase().includes(searchQuery.toLowerCase()));

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
							<TableHead className="text-primary whitespace-nowrap">Grade</TableHead>

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
								<TableCell className="text-primary text-sm">{score.title}</TableCell>
								<TableCell className="text-primary text-sm font-medium">{score.techScore?.toLocaleString()}</TableCell>
								<TableCell className="text-primary text-sm font-medium">{getOngekiGrade(score.techScore ?? 0)}</TableCell>

								<TableCell className="text-primary text-sm">
									<div className="flex items-center">
										<span className="mr-4">{((score.playerRating ?? 0) / 1000).toFixed(3)}</span>{" "}
										{score.rating_change === "Increase" && <CircleArrowUp className="h-6 w-6 text-green-500" />}
										{score.rating_change === "Decrease" && <CircleArrowDown className="h-6 w-6 text-red-500" />}
										{score.rating_change === "Same" && <CircleArrowRight className="h-6 w-6 text-gray-500" />}
									</div>
								</TableCell>
								<TableCell className="text-primary text-sm">{getDifficultyFromOngekiChart(score.chartId ?? 0)}</TableCell>
								<TableCell className="text-primary text-sm">{new Date(score.userPlayDate ?? 0).toLocaleString()}</TableCell>
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

export default OngekiScoreTableNew;
