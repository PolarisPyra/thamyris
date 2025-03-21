import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Trophy {
	id: number;
	version: number;
	trophyId: number;
	name: string;
	explainText: string;
	rareType: number;
	imagePath: string | null;
}

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
					isCurrentSelection
						? "text-primary bg-dropdownhover hover:cursor-not-allowed"
						: "bg-dropdown hover:bg-dropdownhover cursor-pointer"
				}`}
			>
				<span className="text-primary block w-full truncate">
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
				className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3"
			>
				<span className="text-primary truncate">{getSelectedLabel()}</span>
				<ChevronDown className={`text-primary h-5 w-5 transition-transform ${openDropdown === type ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence>
				{openDropdown === type && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2 overflow-hidden"
					>
						<div className="max-h-[285px] max-w-[400px] space-y-2 overflow-y-auto pr-2">
							{unlockedTrophies?.map((trophy) => renderTrophyOption(trophy))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);

	return (
		<div className="mb-4">
			<button
				onClick={() => handleDropdownToggle(type)}
				className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3"
			>
				<span className="text-primary truncate">{getSelectedLabel()}</span>
				<ChevronDown className={`text-primary h-5 w-5 transition-transform ${openDropdown === type ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence>
				{openDropdown === type && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-2 overflow-hidden"
					>
						<div className="max-h-[285px] max-w-[400px] space-y-2 truncate overflow-y-auto pr-2">
							{unlockedTrophies?.map((trophy) => renderTrophyOption(trophy))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TrophyDropdown;
