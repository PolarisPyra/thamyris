import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useCurrentTrophy, useUnlockedTrophies, useUpdateTrophy } from "@/hooks/chunithm/use-trophies";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { Trophy } from "@/types/types";

import { SubmitButton } from "../common/button";

export const TrophySelector = () => {
	const { data: version } = useChunithmVersion();
	const { data: currentTrophy } = useCurrentTrophy();
	const { data: unlockedTrophies } = useUnlockedTrophies();
	const { mutate: updateTrophy, isPending } = useUpdateTrophy();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [selectedTrophies, setSelectedTrophies] = useState({
		main: 0,
		sub1: 0,
		sub2: 0,
	});

	const isVerseOrAbove = (version || 0) >= 17;

	useEffect(() => {
		if (currentTrophy) {
			setSelectedTrophies({
				main: currentTrophy.trophyId || 0,
				sub1: currentTrophy.trophyIdSub1 || 0,
				sub2: currentTrophy.trophyIdSub2 || 0,
			});
		}
	}, [currentTrophy]);

	const handleDropdownToggle = (dropdownName: string) => {
		setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
	};

	const handleTrophySelect = (type: "main" | "sub1" | "sub2", trophyId: number) => {
		if (!isVerseOrAbove && (type === "sub1" || type === "sub2")) {
			toast.error("Sub trophies are only available in VERSE");
			return;
		}

		const currentTrophyId =
			type === "main"
				? currentTrophy?.trophyId
				: type === "sub1"
					? currentTrophy?.trophyIdSub1
					: currentTrophy?.trophyIdSub2;

		if (trophyId === currentTrophyId) {
			setOpenDropdown(null);
			return;
		}

		setSelectedTrophies((prev) => ({
			...prev,
			[type]: trophyId,
		}));
		setOpenDropdown(null);
	};

	const hasChanges = () => {
		if (!isVerseOrAbove) {
			return selectedTrophies.main !== currentTrophy?.trophyId;
		}

		return (
			selectedTrophies.main !== currentTrophy?.trophyId ||
			selectedTrophies.sub1 !== currentTrophy?.trophyIdSub1 ||
			selectedTrophies.sub2 !== currentTrophy?.trophyIdSub2
		);
	};

	const handleSubmit = () => {
		const updates: {
			mainTrophyId?: number;
			subTrophy1Id?: number;
			subTrophy2Id?: number;
		} = {
			mainTrophyId: selectedTrophies.main,
		};

		if (isVerseOrAbove) {
			if (selectedTrophies.sub1 !== currentTrophy?.trophyIdSub1) {
				updates.subTrophy1Id = selectedTrophies.sub1 || undefined;
			}
			if (selectedTrophies.sub2 !== currentTrophy?.trophyIdSub2) {
				updates.subTrophy2Id = selectedTrophies.sub2 || undefined;
			}
		}

		updateTrophy(updates, {
			onSuccess: () => {
				toast.success("Trophy updated successfully!");
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Failed to update trophy");
			},
		});
	};

	const getSelectedLabel = (type: "main" | "sub1" | "sub2") => {
		const trophyId = selectedTrophies[type];
		const trophy = unlockedTrophies?.find((t) => t.trophyId === trophyId);
		return trophy?.name || `Select ${type === "main" ? "Main" : `Sub ${type === "sub1" ? "1" : "2"}`} Trophy`;
	};

	const renderTrophyOption = (type: "main" | "sub1" | "sub2", trophy: Trophy) => {
		const isCurrentSelection =
			type === "main"
				? trophy.trophyId === currentTrophy?.trophyId
				: type === "sub1"
					? trophy.trophyId === currentTrophy?.trophyIdSub1
					: trophy.trophyId === currentTrophy?.trophyIdSub2;

		return (
			<div
				key={trophy.id}
				onClick={() => handleTrophySelect(type, trophy.trophyId)}
				className={`cursor-pointer rounded-md p-2 transition-colors ${
					isCurrentSelection ? "cursor-not-allowed bg-gray-600 text-gray-400" : "bg-gray-700 hover:bg-gray-600"
				}`}
			>
				<span className="truncate text-gray-200">
					{trophy.name}
					{isCurrentSelection && " (Current)"}
				</span>
			</div>
		);
	};

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 pb-4 md:flex-row md:gap-8 md:pt-15">
			{/* TODO: Add trophy preview image */}

			{/* <div className="relative flex h-[100px] w-full items-center justify-center md:w-[300px]">
			</div> */}
			<div className="bg-opacity-50 w-full rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:w-[400px] md:p-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-100">Trophy Settings</h2>

				{/* Main Trophy Dropdown */}
				<div className="mb-4">
					<button
						onClick={() => handleDropdownToggle("main")}
						className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
					>
						<span className="truncate text-gray-200">{getSelectedLabel("main")}</span>
						<ChevronDown
							className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === "main" ? "rotate-180" : ""}`}
						/>
					</button>
					<AnimatePresence>
						{openDropdown === "main" && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
								exit={{ opacity: 0, height: 0 }}
								className="mt-2 overflow-hidden"
							>
								<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
									{unlockedTrophies?.map((trophy) => renderTrophyOption("main", trophy))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Sub Trophy dropdowns - Only shown for version 17+ */}
				{isVerseOrAbove && (
					<>
						{/* Sub Trophy 1 Dropdown */}
						<div className="mb-4">
							<button
								onClick={() => handleDropdownToggle("sub1")}
								className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
							>
								<span className="truncate text-gray-200">{getSelectedLabel("sub1")}</span>
								<ChevronDown
									className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === "sub1" ? "rotate-180" : ""}`}
								/>
							</button>
							<AnimatePresence>
								{openDropdown === "sub1" && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-2 overflow-hidden"
									>
										<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
											{unlockedTrophies?.map((trophy) => renderTrophyOption("sub1", trophy))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Sub Trophy 2 Dropdown */}
						<div className="mb-4">
							<button
								onClick={() => handleDropdownToggle("sub2")}
								className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
							>
								<span className="truncate text-gray-200">{getSelectedLabel("sub2")}</span>
								<ChevronDown
									className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === "sub2" ? "rotate-180" : ""}`}
								/>
							</button>
							<AnimatePresence>
								{openDropdown === "sub2" && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-2 overflow-hidden"
									>
										<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
											{unlockedTrophies?.map((trophy) => renderTrophyOption("sub2", trophy))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</>
				)}

				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update Trophy"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default TrophySelector;
