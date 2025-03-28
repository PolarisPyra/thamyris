import React, { useState } from "react";

import { Search, Star } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OngekiGekForceRating, getDifficultyFromOngekiChart, getOngekiGrade } from "@/utils/helpers";

interface RatingTable {
	id: number;
	user: number;
	version: number;
	type: string;
	index: number;
	musicId: number | null;
	difficultId: number | null;
	romVersionCode: number | null;
	techScoreMax: number | null;
	platinumScoreMax: number | null;
	platinumScoreStar: number | null;
	artist: string | undefined;
	title: string;
	level: number;
	chartId: number;
	genre: string;
	noteCount: number;
	isFullCombo?: number | null;
	isFullBell?: number | null;
	isAllBreake?: number | null;
}

interface RatingFrameTableProps {
	data: RatingTable[];
	title: string;
}

const OngekiRatingTableNew: React.FC<RatingFrameTableProps> = ({ data, title }) => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const filteredSongs = data.filter((song) => song.title?.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div className="bg-card rounded-md p-4 sm:p-6">
			<div className="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-6 sm:flex-row">
				<h2 className="text-primary text-lg font-semibold sm:text-xl">{title}</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Search songs..."
						className="bg-searchbar text-primary placeholder-primary focus:ring-primary w-full rounded-lg py-2 pr-4 pl-10 focus:outline-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Search className="text-primary absolute top-2.5 left-3" size={18} />
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-seperator border-b hover:bg-transparent">
							<TableHead className="text-primary">#</TableHead>
							<TableHead className="text-primary">Song</TableHead>
							<TableHead className="text-primary">Score</TableHead>
							<TableHead className="text-primary">Grade</TableHead>
							<TableHead className="text-primary">Rating</TableHead>
							<TableHead className="text-primary">PScore</TableHead>
							<TableHead className="text-primary">PStars</TableHead>
							<TableHead className="text-primary">Level</TableHead>
							<TableHead className="text-primary">Difficulty</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSongs.map((song, index) => {
							const maxPossibleScore = song.noteCount * 2;

							return (
								<TableRow key={song.id ?? index} className="border-seperator hover:bg-hover border-b">
									<TableCell className="text-primary text-sm">{index + 1}</TableCell>
									<TableCell className="text-primary max-w-[140px] truncate text-sm">{song.title}</TableCell>
									<TableCell className="text-primary text-sm">{song.techScoreMax?.toLocaleString()}</TableCell>
									<TableCell className="text-primary text-sm">{getOngekiGrade(song.techScoreMax!)}</TableCell>
									<TableCell className="text-primary text-sm">
										{(
											OngekiGekForceRating(
												song.level!,
												song.techScoreMax!,
												song.isFullCombo ?? 0,
												song.isAllBreake ?? 0,
												song.isFullBell ?? 0
											) / 1000
										).toFixed(3)}
									</TableCell>
									<TableCell className="text-primary text-sm">
										{`${(song.platinumScoreMax ?? 0).toLocaleString()} / ${maxPossibleScore.toLocaleString()}`}
									</TableCell>
									<TableCell className="text-primary text-sm">
										{(song.platinumScoreStar ?? 0) > 0 && (
											<>
												<Star className="inline-block text-yellow-300" size={16} />
												<span className="ml-1">{song.platinumScoreStar?.toLocaleString()}</span>
											</>
										)}
									</TableCell>
									<TableCell className="text-primary text-sm">{song.level}</TableCell>
									<TableCell className="text-primary text-sm">
										<span>{getDifficultyFromOngekiChart(song.chartId!)}</span>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				{filteredSongs.length === 0 && (
					<div className="text-primary py-8 text-center">
						<p>No songs found. Try a different search term.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default OngekiRatingTableNew;
