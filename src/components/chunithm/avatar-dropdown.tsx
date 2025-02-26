import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { avatarData } from "@/utils/types";

interface AccessoryDropdownProps {
	accessoryType: string;
	options: avatarData[];
	openDropdown: string | null;
	handleDropdownToggle: (part: string) => void;
	handleChange: (part: string, image: string) => void;
	getSelectedLabel: (part: string) => string;
}

export const AccessoryDropdown = ({
	accessoryType,
	options,
	openDropdown,
	handleDropdownToggle,
	handleChange,
	getSelectedLabel,
}: AccessoryDropdownProps) => (
	<div key={accessoryType} className="mb-4">
		<button
			onClick={() => handleDropdownToggle(accessoryType)}
			className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
		>
			<span className="text-gray-200 capitalize">{getSelectedLabel(accessoryType)}</span>
			<ChevronDown
				className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === accessoryType ? "rotate-180" : ""}`}
			/>
		</button>
		<AnimatePresence>
			{openDropdown === accessoryType && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-2"
				>
					<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
						{options.map((option) => (
							<div
								key={option.image}
								onClick={() => handleChange(accessoryType, option.image)}
								className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
							>
								<span className="text-gray-200">{option.label}</span>
							</div>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	</div>
);
