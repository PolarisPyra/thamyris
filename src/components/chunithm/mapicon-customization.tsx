import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";
import { toast } from "sonner";
import { useMapIcons, useCurrentMapIcon, useUpdateMapIcon } from "@/hooks/use-mapicon";
import Spinner from "../common/spinner";

const MapiconSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: mapIcons, isLoading: isLoadingIcons } = useMapIcons();
	const { data: currentIcon, isLoading: isLoadingCurrent } = useCurrentMapIcon();
	const { mutate: updateIcon, isPending } = useUpdateMapIcon();

	const [selectedIcon, setSelectedIcon] = useState<string>("");

	// Set initial selected icon when data loads
	React.useEffect(() => {
		if (currentIcon) {
			setSelectedIcon(currentIcon.imagePath);
		} else if (mapIcons && mapIcons.length > 0) {
			setSelectedIcon(mapIcons[0].imagePath);
		}
	}, [currentIcon, mapIcons]);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const handleSubmit = () => {
		const selected = mapIcons?.find((icon) => icon.imagePath === selectedIcon);

		if (selected) {
			updateIcon(selected.id, {
				onSuccess: () => {
					toast.success("Map icon updated successfully!");
					setOpenDropdown(false);
				},
				onError: (error) => {
					toast.error("Failed to update map icon");
					console.error("Error updating map icon:", error);
				},
			});
		}
	};

	const getSelectedLabel = () => {
		const selected = mapIcons?.find((icon) => icon.imagePath === selectedIcon);
		return selected?.name || "Select Map Icon";
	};

	if (isLoadingIcons || isLoadingCurrent) {
		return (
			<div>
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4">
			<div className="relative w-full md:w-[300px] h-[100px] flex justify-center items-center">
				<img
					src={`/assets/map_icon/${selectedIcon}`}
					alt="Selected map icon"
					className="w-[150px] object-contain"
				/>
			</div>
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700 w-full md:w-[400px]">
				<div className="mb-4">
					<button
						onClick={handleDropdownToggle}
						className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
					>
						<span className="text-gray-200 truncate">{getSelectedLabel()}</span>
						<ChevronDown
							className={`w-5 h-5 text-gray-400 transition-transform ${openDropdown ? "rotate-180" : ""}`}
						/>
					</button>
					<AnimatePresence>
						{openDropdown && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
								exit={{ opacity: 0, height: 0 }}
								className="mt-2 overflow-hidden"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="max-h-[285px] overflow-y-auto space-y-2 pr-2">
									{mapIcons?.map((icon) => (
										<div
											key={icon.id}
											onClick={() => {
												setSelectedIcon(icon.imagePath);
											}}
											className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors overflow-x-hidden"
										>
											<span className="text-gray-200 min-w-[150px] truncate">{icon.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update Map Icon"
					updatingLabel="Updating..."
					disabled={isPending}
				/>
			</div>
		</div>
	);
};

export default MapiconSelector;
