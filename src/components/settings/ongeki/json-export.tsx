import React from "react";

import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useHighestRating, usePlayerRating, useUserRatingBaseHotList } from "@/hooks/ongeki/use-rating";
import { useUserRatingBaseBestList, useUserRatingBaseBestNewList } from "@/hooks/ongeki/use-rating";
import { useUsername } from "@/hooks/users/use-username";
import { getDifficultyFromOngekiChart, getOngekiGrade } from "@/utils/helpers";

const JsonExport = () => {
	const { data: bestList = [] } = useUserRatingBaseBestList();
	const { data: newList = [] } = useUserRatingBaseBestNewList();
	const { data: usernameData } = useUsername();
	const { data: playerRating } = usePlayerRating();
	const { data: highestRating } = useHighestRating();
	const { data: hotList = [] } = useUserRatingBaseHotList();

	const handleExportB45 = () => {
		const b30 = bestList.filter((song) => song.musicId !== 0);
		const new15 = newList.filter((song) => song.musicId !== 0);
		const recent = hotList.filter((song) => song.musicId !== 0);
		const username = usernameData;

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
				rank: getOngekiGrade(song.score),
				diff: getDifficultyFromOngekiChart(song.chartId),
				const: song.level,
				rating: Number((song.rating / 100).toFixed(2)),
				date: Date.now(),
				is_fullbell: song.isFullBell,
				is_allbreak: song.isAllBreake,
				is_fullcombo: song.isFullCombo,
			})),
			news: new15.map((song) => ({
				title: song.title,
				artist: song.artist,
				score: song.score,
				rank: getOngekiGrade(song.score),
				diff: getDifficultyFromOngekiChart(song.chartId),
				const: song.level,
				rating: Number((song.rating / 100).toFixed(2)),
				date: Date.now(),
				is_fullbell: song.isFullBell,
				is_allbreak: song.isAllBreake,
				is_fullcombo: song.isFullCombo,
			})),
			recent: recent.slice(0, 10).map((song) => ({
				title: song.title,
				artist: song.artist,
				score: song.score,
				rank: getOngekiGrade(song.score),
				diff: getDifficultyFromOngekiChart(song.chartId),
				const: song.level,
				rating: Number((song.rating / 100).toFixed(2)),
				date: Date.now(),
			})),
		};

		const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "ongeki_b45_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported B45 data");
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Export Data</h2>
			<SubmitButton
				onClick={handleExportB45}
				defaultLabel="Export ratings as json (for reiwa.f5.si)"
				updatingLabel="Exporting..."
				className="bg-button hover:bg-buttonhover text-lg"
			/>
		</div>
	);
};

export default JsonExport;
