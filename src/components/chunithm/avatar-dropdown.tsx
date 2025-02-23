import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
			className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
		>
			<span className="capitalize text-gray-200">{getSelectedLabel(accessoryType)}</span>
			<ChevronDown
				className={`w-5 h-5 text-gray-400 transition-transform ${
					openDropdown === accessoryType ? "rotate-180" : ""
				}`}
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
					<div className="max-h-[285px] overflow-y-auto space-y-2 pr-2">
						{options.map((option) => (
							<div
								key={option.image}
								onClick={() => handleChange(accessoryType, option.image)}
								className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors"
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
