import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useCurrentNameplates, useNameplates, useUpdateNameplate } from "@/hooks/chunithm";
import { cdnUrl } from "@/lib/cdn";

import Spinner from "../common/spinner";

const NameplateSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: nameplates, isLoading: isLoadingNameplates } = useNameplates();
	const { data: currentNameplate, isLoading: isLoadingCurrent } = useCurrentNameplates();
	const { mutate: updateNameplate, isPending } = useUpdateNameplate();

	const [selectedNameplate, setSelectedNameplate] = useState<string>("");

	const hasChanges = () => {
		const currentPath =
			Array.isArray(currentNameplate) && currentNameplate.length > 0 ? currentNameplate[0].imagePath : "";
		return selectedNameplate !== currentPath;
	};

	// Set initial selected nameplate when data loads
	React.useEffect(() => {
		if (currentNameplate) {
			setSelectedNameplate(currentNameplate[0].imagePath);
		} else if (nameplates && nameplates.length > 0) {
			setSelectedNameplate(nameplates[0].imagePath);
		}
	}, [currentNameplate, nameplates]);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const handleSubmit = () => {
		const selected = nameplates?.find((nameplate) => nameplate.imagePath === selectedNameplate);

		if (selected && hasChanges()) {
			updateNameplate(selected.nameplateId, {
				onSuccess: () => {
					toast.success("Nameplate updated successfully!");
					setOpenDropdown(false);
				},
				onError: (error) => {
					toast.error("Failed to update nameplate");
					console.error("Error updating nameplate:", error);
				},
			});
		}
	};

	const getSelectedLabel = () => {
		const selected = nameplates?.find((nameplate) => nameplate.imagePath === selectedNameplate);
		return selected?.name || "Select Nameplate";
	};

	if (isLoadingNameplates || isLoadingCurrent) {
		return (
			<div>
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 md:flex-row md:gap-8 md:pt-15">
			<div className="flex items-center justify-center self-center md:h-full md:w-[300px]">
				<img
					src={`${cdnUrl}assets/nameplate/${selectedNameplate.replace(".dds", ".png")}`}
					className="w-[250px] object-contain"
					alt="Nameplate"
				/>{" "}
			</div>

			<div className="bg-card w-full rounded-md p-4 md:w-[400px] md:p-6">
				<div className="mb-4">
					<button
						onClick={handleDropdownToggle}
						className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
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
									{nameplates?.map((nameplate) => (
										<div
											key={nameplate.nameplateId}
											onClick={() => {
												setSelectedNameplate(nameplate.imagePath);
											}}
											className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
										>
											<span className="text-primary min-w-[150px] truncate">{nameplate.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update nameplate"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default NameplateSelector;
