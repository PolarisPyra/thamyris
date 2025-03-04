import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import Header from "@/components/common/header";
import { useUserRatingBaseBestList, useUserRatingBaseBestNewList } from "@/hooks/ongeki/use-rating";
import { useUnlockAllCards, useUnlockAllItems, useUnlockSpecificItem } from "@/hooks/ongeki/use-unlocks";
import { useOngekiVersion, useOngekiVersions, useUpdateOngekiVersion } from "@/hooks/ongeki/use-version";
import { getDifficultyFromOngekiChart, getOngekiGrade } from "@/utils/helpers";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const OngekiSettingsPage: React.FC<GameSettingsProps> = () => {
	const { data: ongekiVersion } = useOngekiVersion();
	const { data: versions } = useOngekiVersions();
	const { mutate: updateVersion, isPending: isUpdatingVersion } = useUpdateOngekiVersion();
	const { data: bestList = [] } = useUserRatingBaseBestList();
	const { data: newList = [] } = useUserRatingBaseBestNewList();

	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const [isUnlocking, setIsUnlocking] = useState<{ [key: string]: boolean }>({
		cards: false,
		items: false,
		specific: false,
	});

	const { mutate: unlockAllCards } = useUnlockAllCards();
	const { mutate: unlockAllItems } = useUnlockAllItems();
	const { mutate: unlockSpecificItem } = useUnlockSpecificItem();

	const handleExportB45 = () => {
		const b30 = bestList.filter((song) => song.musicId !== 0);
		const new15 = newList.filter((song) => song.musicId !== 0);

		const formattedData = [...b30, ...new15].map((song) => ({
			title: song.title,
			artist: song.artist,
			score: song.score,
			rank: getOngekiGrade(song.score),
			diff: getDifficultyFromOngekiChart(song.chartId),
			const: song.level,
			rating: (song.rating / 100).toFixed(2),
			date: Date.now(),
			is_fullbell: false,
			is_allbreak: false,
			is_fullcombo: false,
		}));

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

	const getGameTitle = (version: number | undefined): string => {
		if (!version) return "Select a version";

		const versionMap: Record<number, string> = {
			6: "Ongeki Bright",
			7: "Ongeki Bright Memory",
		};

		return versionMap[version] || `Version ${version}`;
	};

	const handleUnlockAllCards = async () => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, cards: true }));
		try {
			unlockAllCards(ongekiVersion, {
				onSuccess: () => {
					toast.success("Successfully unlocked all cards");
				},
				onError: () => {
					toast.error("Failed to unlock cards");
				},
			});
		} finally {
			setIsUnlocking((prev) => ({ ...prev, cards: false }));
		}
	};

	const handleUnlockAllItems = async () => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, items: true }));
		try {
			unlockAllItems(ongekiVersion, {
				onSuccess: () => {
					toast.success("Successfully unlocked all items");
				},
				onError: () => {
					toast.error("Failed to unlock items");
				},
			});
		} finally {
			setIsUnlocking((prev) => ({ ...prev, items: false }));
		}
	};

	const handleUnlockSpecificItem = async (itemKind: number) => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, specific: true }));
		try {
			unlockSpecificItem(
				{ itemKind, version: ongekiVersion },
				{
					onSuccess: () => {
						toast.success("Successfully unlocked items");
					},
					onError: () => {
						toast.error("Failed to unlock items");
					},
				}
			);
		} finally {
			setIsUnlocking((prev) => ({ ...prev, specific: false }));
		}
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
			<Header title={"Ongeki Settings"} />
			<div className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15">
				{/* Version Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Set Ongeki version</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle(0)}
							className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
						>
							<span className="text-gray-200">{getGameTitle(selectedVersion || ongekiVersion)}</span>
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
						defaultLabel="Update Ongeki settings"
						updatingLabel="Updating..."
						className="bg-red-600 text-lg hover:bg-red-700"
						disabled={isUpdatingVersion || !selectedVersion}
					/>
				</div>

				{/* Card Management Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Card Management</h2>
					<SubmitButton
						onClick={handleUnlockAllCards}
						defaultLabel="Unlock all cards"
						updatingLabel="Unlocking..."
						className="bg-red-600 text-lg hover:bg-red-700"
						disabled={isUnlocking.cards}
					/>
				</div>

				{/* Item Management Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="text-xl font-semibold text-gray-100">Item Management</h2>
					<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
						<SubmitButton
							onClick={() => handleUnlockSpecificItem(2)}
							defaultLabel="Unlock nameplates"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
							disabled={isUnlocking.specific}
						/>
						<SubmitButton
							onClick={() => handleUnlockSpecificItem(17)}
							defaultLabel="Unlock costumes"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
							disabled={isUnlocking.specific}
						/>
						<SubmitButton
							onClick={() => handleUnlockSpecificItem(19)}
							defaultLabel="Unlock attachments"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
							disabled={isUnlocking.specific}
						/>
					</div>
					<SubmitButton
						onClick={handleUnlockAllItems}
						defaultLabel="Unlock all items"
						updatingLabel="Unlocking..."
						className="bg-red-600 text-lg hover:bg-red-700"
						disabled={isUnlocking.items}
					/>
				</div>
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Export Data</h2>
					<SubmitButton
						onClick={handleExportB45}
						defaultLabel="Export B45 (Best 30 + New 15)"
						updatingLabel="Exporting..."
						className="bg-green-600 text-lg hover:bg-green-700"
					/>
				</div>
			</div>
		</div>
	);
};

export default OngekiSettingsPage;
