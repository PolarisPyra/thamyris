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
			<div className="flex h-full items-center justify-center md:w-[300px]">
				<img src={`${cdnUrl}assets/map_icon/${selectedIcon}.png`} className="w-[130px] object-contain" />
			</div>
			<div className="bg-card w-full rounded-md p-4 md:w-[400px] md:p-6">
				<div className="mb-4">
					<button
						onClick={handleDropdownToggle}
						className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3"
					>
						<span className="text-primary truncate">{getSelectedLabel()}</span>
						<ChevronDown className={`text-primary h-5 w-5 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
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
											className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
										>
											<span className="text-primary min-w-[150px] truncate">{icon.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update map icon"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default MapiconSelector;
