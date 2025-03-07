import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useCurrentMapIcon, useMapIcons, useUpdateMapIcon } from "@/hooks/chunithm/use-mapicon";
import { cdnUrl } from "@/lib/cdn";

import Spinner from "../common/spinner";

const MapiconSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: mapIcons, isLoading: isLoadingIcons } = useMapIcons();
	const { data: currentIcon, isLoading: isLoadingCurrent } = useCurrentMapIcon();
	const { mutate: updateIcon, isPending } = useUpdateMapIcon();

	const [selectedIcon, setSelectedIcon] = useState<string>("");

	const hasChanges = () => {
		return selectedIcon !== currentIcon?.imagePath;
	};

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

		if (selected && hasChanges()) {
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
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 pb-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative flex h-[100px] w-full items-center justify-center md:w-[300px]">
				<img
					src={`${cdnUrl}assets/map_icon/${selectedIcon}.png`}
					className="w-[130px] object-contain pb-4 sm:p-0 md:p-0 lg:p-0 xl:p-0"
				/>
			</div>
			<div className="bg-opacity-50 w-full rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:w-[400px] md:p-6">
				<div className="mb-4">
					<button
						onClick={handleDropdownToggle}
						className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
					>
						<span className="truncate text-gray-200">{getSelectedLabel()}</span>
						<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
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
								<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
									{mapIcons?.map((icon) => (
										<div
											key={icon.id}
											onClick={() => {
												setSelectedIcon(icon.imagePath);
											}}
											className="cursor-pointer overflow-x-hidden rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
										>
											<span className="min-w-[150px] truncate text-gray-200">{icon.name}</span>
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
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default MapiconSelector;
