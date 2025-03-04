import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import Header from "@/components/common/header";
import { usePlayerRating, useUserRatingBaseHotList, useUserRatingBaseList } from "@/hooks/chunithm/use-rating";
import { useLimitedTickets, useLockSongs, useUnlimitedTickets, useUnlockAllSongs } from "@/hooks/chunithm/use-unlocks";
import { useChunithmVersion, useChunithmVersions, useUpdateChunithmVersion } from "@/hooks/chunithm/use-version";
import { useUsername } from "@/hooks/common/use-username";
import { getDifficultyFromChunithmChart, getGrade } from "@/utils/helpers";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const ChunithmSettingsPage: React.FC<GameSettingsProps> = () => {
	const { data: chunithmVersion } = useChunithmVersion();
	const { data: versions } = useChunithmVersions();
	const { data: baseList = [] } = useUserRatingBaseList();
	const { data: usernameData } = useUsername();
	const { data: playerRating } = usePlayerRating();
	const { data: hotList = [] } = useUserRatingBaseHotList();

	const { mutate: updateVersion, isPending } = useUpdateChunithmVersion();
	const { mutate: unlockSongs, isPending: isUnlockingSongs } = useUnlockAllSongs();
	const { mutate: lockSongs, isPending: isLockingSongs } = useLockSongs();
	const { mutate: enableUnlimited, isPending: isEnablingUnlimited } = useUnlimitedTickets();
	const { mutate: disableUnlimited, isPending: isDisablingUnlimited } = useLimitedTickets();

	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

	const handleExportB30 = () => {
		const username = usernameData;

		const b30 = baseList.sort((a, b) => b.rating - a.rating);

		const formattedData = {
			honor: "",
			name: username || "Player",
			rating: Number(((playerRating ?? 0) / 100).toFixed(2)),
			ratingMax: Number(((playerRating ?? 0) / 100).toFixed(2)),
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
	const getGameTitle = (version: number | undefined): string => {
		if (!version) return "Select a version";

		const versionMap: Record<number, string> = {
			11: "Chunithm New",
			12: "Chunithm New Plus",
			13: "Chunithm Sun",
			14: "Chunithm Sun Plus",
			15: "Chunithm Luminous",
			16: "Chunithm Luminous Plus",
			17: "Chunithm Verse",
		};

		return versionMap[version] || `Version ${version}`;
	};

	const handleVersionChange = (version: number) => {
		setSelectedVersion(version);
		setOpenDropdown(null);
	};

	const handleDropdownToggle = (section: number) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const handleUpdate = () => {
		if (!selectedVersion) {
			toast.error("Please select a version first");
			return;
		}

		updateVersion(selectedVersion.toString(), {
			onSuccess: () => {
				toast.success("Successfully updated game version");
			},
			onError: () => {
				toast.error("Failed to update game version");
			},
		});
	};

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Chunithm Settings"} />

			<div className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15">
				{/* Version Settings Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Set Chunithm version</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle(0)}
							className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
						>
							<span className="text-gray-200">{getGameTitle(selectedVersion || chunithmVersion)}</span>
							<ChevronDown
								className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === 0 ? "rotate-180" : ""}`}
							/>
						</button>

						<AnimatePresence>
							{openDropdown === 0 && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="mt-2"
								>
									<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
										{versions?.map((version) => (
											<div
												key={version}
												onClick={() => handleVersionChange(version)}
												className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
											>
												<span className="text-gray-200">{getGameTitle(version)}</span>
											</div>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<SubmitButton
						onClick={handleUpdate}
						defaultLabel="Update Chunithm settings"
						updatingLabel="Updating..."
						className="bg-red-600 hover:bg-red-700"
						disabled={isPending || !selectedVersion}
					/>
				</div>

				{/* Song Management Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Manage Songs</h2>
					<div className="flex gap-4">
						<SubmitButton
							onClick={() => {
								unlockSongs(undefined, {
									onSuccess: () => toast.success("Successfully unlocked all songs"),
									onError: () => toast.error("Failed to unlock songs"),
								});
							}}
							defaultLabel="Unlock All Songs"
							updatingLabel="Unlocking..."
							className="bg-green-600 hover:bg-green-700"
							disabled={isUnlockingSongs}
						/>
						<SubmitButton
							onClick={() => {
								lockSongs(undefined, {
									onSuccess: () => toast.success("Successfully locked songs"),
									onError: () => toast.error("Failed to lock songs"),
								});
							}}
							defaultLabel="Lock Songs"
							updatingLabel="Locking..."
							className="bg-red-600 hover:bg-red-700"
							disabled={isLockingSongs}
						/>
					</div>
				</div>

				{/* Ticket Management Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Manage Tickets</h2>
					<div className="flex gap-4">
						<SubmitButton
							onClick={() => {
								enableUnlimited(undefined, {
									onSuccess: () => toast.success("Successfully enabled unlimited tickets"),
									onError: () => toast.error("Failed to enable unlimited tickets"),
								});
							}}
							defaultLabel="Enable Unlimited Tickets"
							updatingLabel="Enabling..."
							className="bg-green-600 hover:bg-green-700"
							disabled={isEnablingUnlimited}
						/>
						<SubmitButton
							onClick={() => {
								disableUnlimited(undefined, {
									onSuccess: () => toast.success("Successfully disabled unlimited tickets"),
									onError: () => toast.error("Failed to disable unlimited tickets"),
								});
							}}
							defaultLabel="Disable Unlimited Tickets"
							updatingLabel="Disabling..."
							className="bg-red-600 hover:bg-red-700"
							disabled={isDisablingUnlimited}
						/>
					</div>
				</div>
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Export Data</h2>
					<SubmitButton
						onClick={handleExportB30}
						defaultLabel="Export ratings as json (for reiwa.f5.si)"
						updatingLabel="Exporting..."
						className="bg-green-600 text-lg hover:bg-green-700"
					/>
				</div>
			</div>
		</div>
	);
};

export default ChunithmSettingsPage;
