import React from "react";

import { toast } from "sonner";

import {
	useHighestRating,
	usePlayerRating,
	useUserRatingBaseHotList,
	useUserRatingBaseList,
} from "@/hooks/chunithm/use-rating";
import { useUsername } from "@/hooks/users/use-username";
import { getDifficultyFromChunithmChart, getGrade } from "@/utils/helpers";

import { SubmitButton } from "../../common/button";

const JsonExport = () => {
	const { data: baseList = [] } = useUserRatingBaseList();
	const { data: usernameData } = useUsername();
	const { data: playerRating } = usePlayerRating();
	const { data: hotList = [] } = useUserRatingBaseHotList();
	const { data: highestRating } = useHighestRating();

	const handleExportB30 = () => {
		const username = usernameData;

		const b30 = baseList.sort((a, b) => b.rating - a.rating);

		const formattedData = {
			honor: "",
			name: username || "Player",
			rating: Number(((playerRating ?? 0) / 100).toFixed(2)),
			ratingMax: Number(((highestRating ?? 0) / 100).toFixed(2)),
			updatedAt: new Date().toISOString(),
			best: b30.map((song) => ({
				title: song.title,
				artist: song.artist,
				score: song.score,
				rank: getGrade(song.score),
				diff: getDifficultyFromChunithmChart(song.chartId),
				const: song.level,
				rating: Number((song.rating / 100).toFixed(2)),
				date: Date.now(),
				is_fullbell: song.isFullBell,
				is_allbreak: song.isAllBreake,
				is_fullcombo: song.isFullCombo,
			})),
			recent: hotList.slice(0, 10).map((song) => ({
				title: song.title,
				artist: song.artist,
				score: song.score,
				rank: getGrade(song.score),
				diff: getDifficultyFromChunithmChart(song.chartId),
				const: song.level,
				rating: Number((song.rating / 100).toFixed(2)),
				date: Date.now(),
			})),
		};

		const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chunithm_b30_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported B30 data");
	};
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Export Data</h2>
			<SubmitButton
				onClick={handleExportB30}
				defaultLabel="Export ratings as json (for reiwa.f5.si)"
				updatingLabel="Exporting..."
				className="bg-green-600 text-lg hover:bg-green-700"
			/>
		</div>
	);
};

export default JsonExport;
