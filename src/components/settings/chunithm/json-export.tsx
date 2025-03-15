import React from "react";

import { toast } from "sonner";

<<<<<<< HEAD
import { useKamaitachiExport } from "@/hooks/chunithm/use-kamatachi";
import { useReiwaExport } from "@/hooks/chunithm/use-reiwa";
=======
import {
	useHighestRating,
	useKamaitachiExport,
	usePlayerRating,
	useUserRatingBaseHotList,
	useUserRatingBaseList,
} from "@/hooks/chunithm";
import { useCurrentUser } from "@/hooks/users";
import { getDifficultyFromChunithmChart, getGrade } from "@/utils/helpers";
>>>>>>> 9309d71 (move some bits around)

import { SubmitButton } from "../../common/button";

const JsonExport = () => {
<<<<<<< HEAD
	const { data: exportData, isLoading } = useReiwaExport();
	const { data: kamaitachiData } = useKamaitachiExport();

	const handleExportReiwa = () => {
		if (!exportData) {
			toast.error("No export data available");
			return;
		}

		const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
=======
	const { username } = useCurrentUser();
	const { data: baseList = [] } = useUserRatingBaseList();
	const { data: playerRating } = usePlayerRating();
	const { data: hotList = [] } = useUserRatingBaseHotList();
	const { data: highestRating } = useHighestRating();
	const { data: kamaitachiData } = useKamaitachiExport();

	const handleExportReiwa = () => {
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
>>>>>>> 9309d71 (move some bits around)
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chunithm_reiwa_export.json";
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
			<div className="flex gap-4">
				<SubmitButton
					onClick={handleExportReiwa}
					defaultLabel="Export ratings as json (for reiwa.f5.si)"
					updatingLabel="Exporting..."
					disabled={isLoading}
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
