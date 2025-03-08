import React, { useEffect, useState } from "react";

import { toast } from "sonner";

import { useCurrentTrophy, useUnlockedTrophies, useUpdateTrophy } from "@/hooks/chunithm/use-trophies";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";
import { honorBackgrounds } from "@/utils/consts";

import { SubmitButton } from "../common/button";
import TrophyDropdown from "./TrophyDropdown";

export const TrophySelector = () => {
	const { data: version } = useChunithmVersion();
	const { data: currentTrophy } = useCurrentTrophy();
	const { data: unlockedTrophies } = useUnlockedTrophies();
	const { mutate: updateTrophy, isPending } = useUpdateTrophy();
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
	const handleTrophySelect = (type: "main" | "sub1" | "sub2", trophyId: number) => {
		if (!isVerseOrAbove && (type === "sub1" || type === "sub2")) {
			toast.error("Sub trophies are only available in VERSE");
			return;
		}

		const isMainTrophy = type === "main";
		const isSubTrophy1 = type === "sub1";
		const isSubTrophy2 = type === "sub2";

		let currentTrophyId: number | null | undefined;
		if (isMainTrophy) {
			currentTrophyId = currentTrophy?.trophyId;
		} else if (isSubTrophy1) {
			currentTrophyId = currentTrophy?.trophyIdSub1;
		} else if (isSubTrophy2) {
			currentTrophyId = currentTrophy?.trophyIdSub2;
		}

		if (trophyId === currentTrophyId) {
			return;
		}

		setSelectedTrophies((prev) => ({
			...prev,
			[type]: trophyId,
		}));

		const selectedTrophy = unlockedTrophies?.find((t) => t.trophyId === trophyId);
		if (selectedTrophy) {
			const background = honorBackgrounds[selectedTrophy.rareType as keyof typeof honorBackgrounds];

			if (isMainTrophy) {
				setSelectedBackgrounds((prev) => [background, ...prev.slice(1)]);
				setSelectedTrophyNames((prev) => [selectedTrophy.name, ...prev.slice(1)]);
			} else if (isSubTrophy1) {
				setSelectedBackgrounds((prev) => [...prev.slice(0, 1), background, ...prev.slice(2)]);
				setSelectedTrophyNames((prev) => [prev[0], selectedTrophy.name, prev[2]]);
			} else if (isSubTrophy2) {
				setSelectedBackgrounds((prev) => [...prev.slice(0, 2), background]);
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

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 pb-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative h-[40px] w-full flex-col items-center justify-center md:w-[300px]">
				{selectedBackgrounds.map((bg, index) => (
					<div key={index} className="relative flex h-[40px] w-full items-center justify-center">
						{bg && (
							<div className="absolute inset-0 h-full w-full">
								<img className="w-full object-cover" src={bg} />
								{selectedTrophyNames[index] && (
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="mr-2 mb-2 ml-2 max-w-[300px] truncate text-center text-sm font-bold text-black">
											{selectedTrophyNames[index]}
										</span>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			<div className="bg-opacity-50 w-full rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:w-[400px] md:p-6">
				<h2 className="mb-4 text-xl font-semibold text-gray-100">Trophy Settings</h2>

				{/* Main Trophy Dropdown */}
				<TrophyDropdown
					type="main"
					selectedTrophies={selectedTrophies}
					unlockedTrophies={unlockedTrophies}
					handleTrophySelect={handleTrophySelect}
				/>

				{/* Sub Trophy dropdowns - Only shown for version 17+ */}
				{isVerseOrAbove && (
					<>
						{/* Sub Trophy 1 Dropdown */}
						<TrophyDropdown
							type="sub1"
							selectedTrophies={selectedTrophies}
							unlockedTrophies={unlockedTrophies}
							handleTrophySelect={handleTrophySelect}
						/>
						{/* Sub Trophy 2 Dropdown */}
						<TrophyDropdown
							type="sub2"
							selectedTrophies={selectedTrophies}
							unlockedTrophies={unlockedTrophies}
							handleTrophySelect={handleTrophySelect}
						/>
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
