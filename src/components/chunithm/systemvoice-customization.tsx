import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useCurrentSystemVoice, useSystemVoices, useUpdateSystemVoice } from "@/hooks/chunithm/use-systemvoice";
import { cdnUrl } from "@/lib/cdn";

import Spinner from "../common/spinner";

const SystemvoiceSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: systemVoices, isLoading: isLoadingVoices } = useSystemVoices();
	const { data: currentVoice, isLoading: isLoadingCurrent } = useCurrentSystemVoice();
	const { mutate: updateVoice, isPending } = useUpdateSystemVoice();

	const [selectedVoice, setSelectedVoice] = useState<string>("");

	// Set initial selected voice when data loads
	React.useEffect(() => {
		if (currentVoice) {
			setSelectedVoice(currentVoice.imagePath);
		} else if (systemVoices && systemVoices.length > 0) {
			setSelectedVoice(systemVoices[0].imagePath);
		}
	}, [currentVoice, systemVoices]);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const hasChanges = () => {
		return selectedVoice !== currentVoice?.imagePath;
	};

	const handleSubmit = () => {
		const selected = systemVoices?.find((voice) => voice.imagePath === selectedVoice);

		if (selected && hasChanges()) {
			updateVoice(selected.id, {
				onSuccess: () => {
					toast.success("System voice updated successfully!");
					setOpenDropdown(false);
				},
				onError: (error) => {
					toast.error("Failed to update system voice");
					console.error("Error updating system voice:", error);
				},
			});
		}
	};

	const getSelectedLabel = () => {
		const selected = systemVoices?.find((voice) => voice.imagePath === selectedVoice);
		return selected?.name || "Select System Voice";
	};

	if (isLoadingVoices || isLoadingCurrent) {
		return (
			<div>
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col justify-center gap-4 px-4 pt-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative flex h-[100px] w-full items-center justify-center md:w-[300px]">
				<img
					loading="lazy"
					src={`${cdnUrl}assets/system_voice/${selectedVoice}.png`}
					className="w-[200px] object-contain"
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
									{systemVoices?.map((voice) => (
										<div
											key={voice.id}
											onClick={() => {
												setSelectedVoice(voice.imagePath);
											}}
											className="cursor-pointer overflow-x-hidden rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
										>
											<span className="min-w-[150px] truncate text-gray-200">{voice.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update System Voice"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default SystemvoiceSelector;
