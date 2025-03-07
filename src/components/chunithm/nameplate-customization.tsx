import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useCurrentNameplate, useNameplates, useUpdateNameplate } from "@/hooks/chunithm/use-nameplates";
import { cdnUrl } from "@/lib/cdn";

import Spinner from "../common/spinner";

const NameplateSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: nameplates, isLoading: isLoadingNameplates } = useNameplates();
	const { data: currentNameplate, isLoading: isLoadingCurrent } = useCurrentNameplate();
	const { mutate: updateNameplate, isPending } = useUpdateNameplate();

	const [selectedNameplate, setSelectedNameplate] = useState<string>("");

	const hasChanges = () => {
		return selectedNameplate !== currentNameplate?.imagePath;
	};

	// Set initial selected nameplate when data loads
	React.useEffect(() => {
		if (currentNameplate) {
			setSelectedNameplate(currentNameplate.imagePath);
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
			updateNameplate(selected.id, {
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
			<div className="relative flex h-[100px] w-full items-center justify-center md:w-[300px]">
				<img src={`${cdnUrl}assets/nameplate/${selectedNameplate}.png`} className="w-[250px] object-contain" />
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
									{nameplates?.map((nameplate) => (
										<div
											key={nameplate.id}
											onClick={() => {
												setSelectedNameplate(nameplate.imagePath);
											}}
											className="cursor-pointer overflow-x-hidden rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
										>
											<span className="min-w-[150px] truncate text-gray-200">{nameplate.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update Nameplate"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default NameplateSelector;
