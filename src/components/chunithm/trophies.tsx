import React, { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { useChunithmVersion, useCurrentTrophy, useUnlockedTrophies, useUpdateTrophy } from "@/hooks/chunithm";
import { useHonorBackground } from "@/hooks/chunithm/use-trophies";
import { TrophyRareType, honorBackgrounds } from "@/lib/constants";

import { SubmitButton } from "../common/button";
import TrophyDropdown from "./trophy-dropdown";

export const TrophySelector = () => {
	const version = useChunithmVersion();
	const { data: currentTrophyData } = useCurrentTrophy();
	const currentTrophy = currentTrophyData?.[0];
	const { data: unlockedTrophies } = useUnlockedTrophies();
	const { mutate: updateTrophy, isPending } = useUpdateTrophy();
	const [selectedTrophies, setSelectedTrophies] = useState({
		main: 0,
		sub1: 0,
		sub2: 0,
	});
	const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
	const [selectedTrophyNames, setSelectedTrophyNames] = useState<string[]>([]);
	const [selectedTrophyRareTypes, setSelectedTrophyRareTypes] = useState<number[]>([]);

	const isVerseOrAbove = (version || 0) >= 17;
	const getHonorBackground = useHonorBackground();

	const isImage = (type: number) => {
		return (
			type !== TrophyRareType.Kop &&
			type !== TrophyRareType.Lamp &&
			type !== TrophyRareType.Lamp2 &&
			type !== TrophyRareType.Lamp3
		);
	};

	useEffect(() => {
		if (!currentTrophy || !unlockedTrophies) return;

		setSelectedTrophies({
			main: currentTrophy.trophyId || 0,
			sub1: currentTrophy.trophyIdSub1 || 0,
			sub2: currentTrophy.trophyIdSub2 || 0,
		});
	}, [currentTrophy, unlockedTrophies]);

	useEffect(() => {
		if (!unlockedTrophies) return;

		const mainTrophy = unlockedTrophies.find((t) => t.trophyId === selectedTrophies.main);
		const sub1Trophy = unlockedTrophies.find((t) => t.trophyId === selectedTrophies.sub1);
		const sub2Trophy = unlockedTrophies.find((t) => t.trophyId === selectedTrophies.sub2);

		if (isVerseOrAbove) {
			setSelectedBackgrounds([
				mainTrophy ? getHonorBackground(mainTrophy) : honorBackgrounds[TrophyRareType.Staff],
				sub1Trophy ? getHonorBackground(sub1Trophy) : honorBackgrounds[TrophyRareType.Staff],
				sub2Trophy ? getHonorBackground(sub2Trophy) : honorBackgrounds[TrophyRareType.Staff],
			]);
			setSelectedTrophyNames([mainTrophy?.name || "", sub1Trophy?.name || "", sub2Trophy?.name || ""]);
			setSelectedTrophyRareTypes([mainTrophy?.rareType || 0, sub1Trophy?.rareType || 0, sub2Trophy?.rareType || 0]);
		} else {
			setSelectedBackgrounds([mainTrophy ? getHonorBackground(mainTrophy) : honorBackgrounds[TrophyRareType.Normal]]);
			setSelectedTrophyNames([mainTrophy?.name || ""]);
			setSelectedTrophyRareTypes([mainTrophy?.rareType || 0]);
		}
		// console.log(mainTrophy);
	}, [selectedTrophies, unlockedTrophies, isVerseOrAbove, getHonorBackground]);
	const handleTrophySelect = useCallback(
		(type: "main" | "sub1" | "sub2", trophyId: number) => {
			if (!isVerseOrAbove && (type === "sub1" || type === "sub2")) {
				toast.error("Sub trophies are only available in VERSE");
				return;
			}

			setSelectedTrophies((prev) => ({
				...prev,
				[type]: trophyId,
			}));
		},
		[isVerseOrAbove]
	);

	const hasChanges = useCallback(() => {
		if (!isVerseOrAbove) {
			return selectedTrophies.main !== currentTrophy?.trophyId;
		}

		return (
			selectedTrophies.main !== currentTrophy?.trophyId ||
			selectedTrophies.sub1 !== currentTrophy?.trophyIdSub1 ||
			selectedTrophies.sub2 !== currentTrophy?.trophyIdSub2
		);
	}, [isVerseOrAbove, selectedTrophies, currentTrophy]);

	const handleSubmit = useCallback(() => {
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
	}, [selectedTrophies, isVerseOrAbove, currentTrophy, updateTrophy]);

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 pb-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative flex-col items-center justify-center md:w-[300px]">
				{selectedBackgrounds.map((bg, index) => (
					<div key={index} className="relative flex h-[40px] w-full items-center justify-center">
						{bg && (
							<div className="absolute inset-0 h-full w-full">
								<img className="w-full object-cover" src={bg} />
								{selectedTrophyNames[index] && isImage(selectedTrophyRareTypes[index]) && (
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
			<div className="bg-card w-full rounded-md p-4 md:w-[400px] md:p-6">
				<h2 className="text-primary mb-4 text-xl font-semibold">Trophy Settings</h2>

				<TrophyDropdown
					type="main"
					selectedTrophies={selectedTrophies}
					unlockedTrophies={unlockedTrophies}
					handleTrophySelect={handleTrophySelect}
				/>

				{/* Sub Trophy dropdowns - Only shown for version 17+ */}
				{isVerseOrAbove && (
					<>
						<TrophyDropdown
							type="sub1"
							selectedTrophies={selectedTrophies}
							unlockedTrophies={unlockedTrophies}
							handleTrophySelect={handleTrophySelect}
						/>
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
					defaultLabel="Update trophy"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default TrophySelector;
