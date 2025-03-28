import React, { useState } from "react";

import { Search } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cdnUrl } from "@/lib/constants";
import { ChunitmRating, getDifficultyFromChunithmChart } from "@/utils/helpers";
import { getChunithmGrade } from "@/utils/helpers";

interface RatingTable {
	id: number;
	user: number;
	version: number;
	type: string;
	index: number;
	musicId: number | null;
	difficultId: number | null;
	romVersionCode: number | null;
	score: number | null;
	artist: string | undefined;
	title: string;
	level: number;
	chartId: number;
	genre: string;
	jacketPath: string;
}

interface RatingFrameTableProps {
	data: RatingTable[];
	title: string;
}

const ChunithmRatingFrameTable = ({ data, title }: RatingFrameTableProps) => {
	const [searchQuery, setSearchQuery] = useState("");

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
							<TableHead className="text-primary">Song</TableHead>
							<TableHead className="text-primary">Score</TableHead>
							<TableHead className="text-primary">Grade</TableHead>
							<TableHead className="text-primary">Rating</TableHead>
							<TableHead className="text-primary">Level</TableHead>
							<TableHead className="text-primary">Difficulty</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSongs.map((song, index) => (
							<TableRow key={song.id ?? index} className="border-seperator hover:bg-hover border-b">
								<TableCell className="text-primary text-sm">
									<div className="flex items-center gap-3">
										<img
											width={50}
											height={50}
											src={`${cdnUrl}assets/jacket/${song.jacketPath.replace(".dds", ".png")}`}
											alt={String(song.title)}
											className="flex-shrink-0"
										/>
										<span className="text-primary max-w- truncate">{song.title}</span>
									</div>
								</TableCell>{" "}
								<TableCell className="text-primary text-sm">{song.score?.toLocaleString()}</TableCell>
								<TableCell className="text-primary text-sm">{getChunithmGrade(song.score!)}</TableCell>
								<TableCell className="text-primary text-sm">
									{(ChunitmRating(song.level!, song.score!) / 100).toFixed(2)}
								</TableCell>
								<TableCell className="text-primary text-sm">{song.level}</TableCell>
								<TableCell className="text-primary text-sm">
									<span>{getDifficultyFromChunithmChart(song.chartId!)}</span>
								</TableCell>
							</TableRow>
						))}
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

export default ChunithmRatingFrameTable;
