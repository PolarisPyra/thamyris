import React, { useEffect, useState } from "react";

import { toast } from "sonner";

import { useChunithmVersion, useCurrentTrophy, useUnlockedTrophies, useUpdateTrophy } from "@/hooks/chunithm";
import { honorBackgrounds } from "@/lib/constants";

import { SubmitButton } from "../common/button";
import TrophyDropdown from "./trophy-dropdown";

export const TrophySelector = () => {
	const version = useChunithmVersion();
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
		// Verify version
		if (!isVerseOrAbove && (type === "sub1" || type === "sub2")) {
			toast.error("Sub trophies are only available in VERSE");
			return;
		}

		// Get trophy index based on type
		let trophyIndex = 0;
		if (type === "main") {
			trophyIndex = 0;
		} else if (type === "sub1") {
			trophyIndex = 1;
		} else if (type === "sub2") {
			trophyIndex = 2;
		}

		// Update selected trophies object
		setSelectedTrophies((prev) => ({
			...prev,
			[type]: trophyId,
		}));

		// Find trophy and update visuals
		const selectedTrophy = unlockedTrophies?.find((t) => t.trophyId === trophyId);
		if (selectedTrophy) {
			const background = honorBackgrounds[selectedTrophy.rareType as keyof typeof honorBackgrounds];

			// Update background at specific index
			setSelectedBackgrounds((prev) => {
				const newBackgrounds = [...prev];
				newBackgrounds[trophyIndex] = background;
				return newBackgrounds;
			});

			// Update trophy name at specific index
			setSelectedTrophyNames((prev) => {
				const newNames = [...prev];
				newNames[trophyIndex] = selectedTrophy.name;
				return newNames;
			});
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
			<div className="relative flex-col items-center justify-center md:w-[300px]">
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
			<div className="bg-card w-full rounded-md p-4 md:w-[400px] md:p-6">
				<h2 className="text-primary mb-4 text-xl font-semibold">Trophy Settings</h2>

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
					defaultLabel="Update trophy"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default TrophySelector;
