import React from "react";

import { CircleArrowDown, CircleArrowRight, CircleArrowUp, Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cdnUrl } from "@/lib/constants";
import { getChunithmGrade, getDifficultyFromChunithmChart } from "@/utils/helpers";

interface ChunithmScore {
	id: number;
	user: number;
	orderId: number | null;
	sortNumber: number | null;
	placeId: number | null;
	playDate: string | null;
	userPlayDate: string | null;
	musicId: number | null;
	level: number | null;
	customId: number | null;
	playedUserId1: number | null;
	playedUserId2: number | null;
	playedUserId3: number | null;
	playedUserName1: string | null;
	playedUserName2: string | null;
	playedUserName3: string | null;
	playedMusicLevel1: number | null;
	playedMusicLevel2: number | null;
	playedMusicLevel3: number | null;
	playedCustom1: number | null;
	playedCustom2: number | null;
	playedCustom3: number | null;
	track: number | null;
	score: number | null;
	rank: number | null;
	maxCombo: number | null;
	maxChain: number | null;
	rateTap: number | null;
	rateHold: number | null;
	rateSlide: number | null;
	rateAir: number | null;
	rateFlick: number | null;
	judgeGuilty: number | null;
	judgeAttack: number | null;
	judgeJustice: number | null;
	judgeCritical: number | null;
	eventId: number | null;
	playerRating: number | null;
	isNewRecord: boolean | null;
	isFullCombo: boolean | null;
	fullChainKind: number | null;
	isAllJustice: boolean | null;
	isContinue: boolean | null;
	isFreeToPlay: boolean | null;
	characterId: number | null;
	skillId: number | null;
	playKind: number | null;
	isClear: number;
	skillLevel: number | null;
	skillEffect: number | null;
	placeName: string | null;
	isMaimai: boolean | null;
	commonId: number | null;
	charaIllustId: number | null;
	romVersion: string | null;
	judgeHeaven: number | null;
	regionId: number | null;
	machineType: number | null;
	ticketId: number | null;
	monthPoint: number | null;
	eventPoint: number | null;
	title?: string;
	jacketPath: string;
	chartId?: number;
	rating_change?: "Increase" | "Decrease" | "Same";
}

interface ChunithmScoreTableProps {
	scores: ChunithmScore[];
	searchQuery: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChunithmScoreTable = ({ scores, searchQuery, onSearchChange }: ChunithmScoreTableProps) => {
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
								<TableCell className="text-primary text-sm">
									<div className="flex items-center gap-3">
										<img
											width={50}
											height={50}
											src={`${cdnUrl}assets/jacket/${score.jacketPath.replace(".dds", ".png")}`}
											alt={String(score.title)}
											className="flex-shrink-0"
										/>
										<span className="text-primary truncate">{score.title}</span>
									</div>
								</TableCell>
								<TableCell className="text-primary text-sm font-medium">{score.score?.toLocaleString()}</TableCell>
								<TableCell className="text-primary text-sm font-medium">{getChunithmGrade(score.score!)}</TableCell>
								<TableCell className="text-primary text-sm">
									<div className="flex items-center">
										<span className="mr-4">{((score.playerRating ?? 0) / 100).toFixed(2)}</span>{" "}
										{score.rating_change === "Increase" && <CircleArrowUp className="h-6 w-6 text-green-500" />}
										{score.rating_change === "Decrease" && <CircleArrowDown className="h-6 w-6 text-red-500" />}
										{score.rating_change === "Same" && <CircleArrowRight className="h-6 w-6 text-gray-500" />}
									</div>
								</TableCell>
								<TableCell className="text-primary text-sm">{getDifficultyFromChunithmChart(score.chartId ?? 0)}</TableCell>
								<TableCell className="text-primary text-sm">
									{score.userPlayDate ? new Date(score.userPlayDate).toLocaleString() : "Unknown"}
								</TableCell>
								<TableCell className="text-primary text-sm">{score.level}</TableCell>
								<TableCell className="text-primary text-sm">
									{score.isFullCombo ? "FC" : ""} {score.isAllJustice ? "AJ" : ""}
								</TableCell>
								<TableCell className="text-primary text-sm">
									{score.isClear === 1 ? "Clear" : score.isClear === 0 ? "Failed" : "Unknown"}
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

export default ChunithmScoreTable;
