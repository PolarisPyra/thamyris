import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useCurrentTrophy, useUnlockedTrophies, useUpdateTrophy } from "@/hooks/chunithm/use-trophies";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { Trophy } from "@/types/types";

import { SubmitButton } from "../common/button";

const honorBackgrounds = {
	0: "/assets/honorBackgrounds/honor_bg_normal.png",
	1: "/assets/honorBackgrounds/honor_bg_bronze.png",
	2: "/assets/honorBackgrounds/honor_bg_silver.png",
	3: "/assets/honorBackgrounds/honor_bg_gold.png",
	4: "/assets/honorBackgrounds/honor_bg_gold.png",
	5: "/assets/honorBackgrounds/honor_bg_platina.png",
	6: "/assets/honorBackgrounds/honor_bg_platina.png",
	7: "/assets/honorBackgrounds/honor_bg_rainbow.png",
	9: "/assets/honorBackgrounds/honor_bg_staff.png",
	10: "/assets/honorBackgrounds/honor_bg_ongeki.png",
	11: "/assets/honorBackgrounds/honor_bg_maimai.png",
	null: "",
};

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
	const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
	const [selectedTrophyNames, setSelectedTrophyNames] = useState<string[]>([]);

	const isVerseOrAbove = (version || 0) >= 17;

	useEffect(() => {
		if (currentTrophy) {
			setSelectedTrophies({
				main: currentTrophy.trophyId || 0,
				sub1: currentTrophy.trophyIdSub1 || 0,
				sub2: currentTrophy.trophyIdSub2 || 0,
			});
			const mainTrophy = unlockedTrophies?.find((t) => t.trophyId === currentTrophy.trophyId);
			const sub1Trophy = unlockedTrophies?.find((t) => t.trophyId === currentTrophy.trophyIdSub1);
			const sub2Trophy = unlockedTrophies?.find((t) => t.trophyId === currentTrophy.trophyIdSub2);

			if (isVerseOrAbove) {
				setSelectedBackgrounds([
					honorBackgrounds[mainTrophy?.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
					honorBackgrounds[sub1Trophy?.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
					honorBackgrounds[sub2Trophy?.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
				]);
				setSelectedTrophyNames([mainTrophy?.name || "", sub1Trophy?.name || "", sub2Trophy?.name || ""]);
			} else {
				setSelectedBackgrounds([
					honorBackgrounds[mainTrophy?.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
				]);
				setSelectedTrophyNames([mainTrophy?.name || ""]);
			}
		}
	}, [currentTrophy, unlockedTrophies, isVerseOrAbove]);

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

		const selectedTrophy = unlockedTrophies?.find((t) => t.trophyId === trophyId);
		if (selectedTrophy) {
			if (type === "main") {
				setSelectedBackgrounds((prev) => [
					honorBackgrounds[selectedTrophy.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
					...prev.slice(1),
				]);
				setSelectedTrophyNames((prev) => [selectedTrophy.name, ...prev.slice(1)]);
			} else if (type === "sub1") {
				setSelectedBackgrounds((prev) => [
					...prev.slice(0, 1),
					honorBackgrounds[selectedTrophy.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
					...prev.slice(2),
				]);
				setSelectedTrophyNames((prev) => [prev[0], selectedTrophy.name, prev[2]]);
			} else if (type === "sub2") {
				setSelectedBackgrounds((prev) => [
					...prev.slice(0, 2),
					honorBackgrounds[selectedTrophy.rareType as keyof typeof honorBackgrounds] || honorBackgrounds[0],
				]);
				setSelectedTrophyNames((prev) => [prev[0], prev[1], selectedTrophy.name]);
			}
		}
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
				className={`relative cursor-pointer rounded-md p-2 transition-colors ${
					isCurrentSelection ? "cursor-not-allowed bg-gray-600 text-gray-400" : "bg-gray-700 hover:bg-gray-600"
				}`}
			>
				<span className="relative truncate text-gray-200">
					{trophy.name}
					{isCurrentSelection && " (Current)"}
				</span>
			</div>
		);
	};

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 pb-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative flex w-full flex-col items-center justify-center md:w-[300px]">
				{selectedBackgrounds.map((bg, index) => (
					<div key={index} className="relative h-[50px] w-full">
						{bg && (
							<>
								<img
									className="absolute h-full w-full object-cover p-3 opacity-50"
									src={bg}
									alt={`Trophy Background ${index + 1}`}
								/>
								{selectedTrophyNames[index] && (
									<div className="absolute inset-0 z-10 flex items-center justify-center">
										<span
											className="text-center text-sm leading-none font-bold text-white drop-shadow-lg"
											style={{ transform: "translateY(1px)" }}
										>
											{selectedTrophyNames[index]}
										</span>
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>
			<div className="bg-opacity-50 w-full rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:w-[400px] md:p-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-100">Trophy Settings</h2>

				{/* Main Trophy Dropdown */}
				<div className="relative mb-4">
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
								className="absolute mt-2 w-full overflow-hidden"
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
						<div className="relative mb-4">
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
										className="absolute mt-2 w-full overflow-hidden"
									>
										<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
											{unlockedTrophies?.map((trophy) => renderTrophyOption("sub1", trophy))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Sub Trophy 2 Dropdown */}
						<div className="relative mb-4">
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
										className="absolute mt-2 w-full overflow-hidden"
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
