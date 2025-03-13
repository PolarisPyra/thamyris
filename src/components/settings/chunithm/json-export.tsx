import React from "react";

import { toast } from "sonner";

import { useKamaitachiExport } from "@/hooks/chunithm/use-kamatachi";
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
	const { data: kamaitachiData } = useKamaitachiExport();

	const handleExportReiwa = () => {
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

	const handleExportKamaitachi = () => {
		if (!kamaitachiData) {
			toast.error("No Kamaitachi data available");
			return;
		}

		const blob = new Blob([JSON.stringify(kamaitachiData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chunithm_kamaitachi_export.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Successfully exported Kamaitachi data");
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Export Data</h2>
			<div className="flex flex-col gap-4">
				<SubmitButton
					onClick={handleExportReiwa}
					defaultLabel="Export ratings as json (for reiwa.f5.si)"
					updatingLabel="Exporting..."
				/>
				<SubmitButton
					onClick={handleExportKamaitachi}
					defaultLabel="Export scores as json (for Kamaitachi)"
					updatingLabel="Exporting..."
				/>
			</div>
		</div>
	);
};

export default JsonExport;
