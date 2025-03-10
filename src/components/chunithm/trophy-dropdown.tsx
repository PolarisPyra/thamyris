import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Trophy } from "@/types/types";

interface TrophyDropdownProps {
	type: "main" | "sub1" | "sub2";
	selectedTrophies: { main: number; sub1: number; sub2: number };
	unlockedTrophies: Trophy[] | undefined;
	handleTrophySelect: (type: "main" | "sub1" | "sub2", trophyId: number) => void;
}

const TrophyDropdown: React.FC<TrophyDropdownProps> = ({
	type,
	selectedTrophies,
	unlockedTrophies,
	handleTrophySelect,
}) => {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const handleDropdownToggle = (dropdownName: string) => {
		setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
	};

	const getSelectedLabel = () => {
		const trophyId = selectedTrophies[type];
		const trophy = unlockedTrophies?.find((t) => t.trophyId === trophyId);
		if (trophy) {
			return trophy.name;
		}
		return "Select Trophy";
	};

	const renderTrophyOption = (trophy: Trophy) => {
		const isCurrentSelection =
			type === "main"
				? trophy.trophyId === selectedTrophies.main
				: type === "sub1"
					? trophy.trophyId === selectedTrophies.sub1
					: trophy.trophyId === selectedTrophies.sub2;

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
		<div className="mb-4">
			<button
				onClick={() => handleDropdownToggle(type)}
				className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
			>
				<span className="truncate text-gray-200">{getSelectedLabel()}</span>
				<ChevronDown
					className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === type ? "rotate-180" : ""}`}
				/>
			</button>
			<AnimatePresence>
				{openDropdown === type && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2 overflow-hidden"
					>
						<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
							{unlockedTrophies?.map((trophy) => renderTrophyOption(trophy))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TrophyDropdown;
