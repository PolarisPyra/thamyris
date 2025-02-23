import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";
import { toast } from "sonner";
import { useNameplates, useCurrentNameplate, useUpdateNameplate } from "@/hooks/use-nameplates";

const NameplateSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: nameplates, isLoading: isLoadingNameplates } = useNameplates();
	const { data: currentNameplate, isLoading: isLoadingCurrent } = useCurrentNameplate();
	const { mutate: updateNameplate, isPending } = useUpdateNameplate();

	const [selectedNameplate, setSelectedNameplate] = useState<string>("");

	// Set initial selected nameplate when data loads
	React.useEffect(() => {
		if (currentNameplate) {
			setSelectedNameplate(currentNameplate.imagePath.replace(".dds", ".png"));
		} else if (nameplates && nameplates.length > 0) {
			setSelectedNameplate(nameplates[0].imagePath);
		}
	}, [currentNameplate, nameplates]);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const handleSubmit = () => {
		const selected = nameplates?.find((nameplate) => nameplate.imagePath === selectedNameplate);

		if (selected) {
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
		return <div>Loading nameplates...</div>;
	}

	return (
		<div className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4">
			<div className="relative w-full md:w-[300px] h-[100px] flex justify-center items-center">
				<img
					src={`/assets/nameplate/${selectedNameplate}`}
					alt="Selected nameplate"
					className="w-[250px] object-contain"
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
									{nameplates?.map((nameplate) => (
										<div
											key={nameplate.id}
											onClick={() => {
												setSelectedNameplate(nameplate.imagePath);
											}}
											className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors overflow-x-hidden"
										>
											<span className="text-gray-200 min-w-[150px] truncate">{nameplate.name}</span>
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
					disabled={isPending}
				/>
			</div>
		</div>
	);
};

export default NameplateSelector;
