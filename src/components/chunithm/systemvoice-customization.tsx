import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useCurrentSystemVoice, useSystemVoices, useUpdateSystemVoice } from "@/hooks/chunithm";
import { cdnUrl } from "@/lib/cdn";

import Spinner from "../common/spinner";

const SystemvoiceSelector = () => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const { data: systemVoices, isLoading: isLoadingVoices } = useSystemVoices();
	const { data: currentVoice, isLoading: isLoadingCurrent } = useCurrentSystemVoice();
	const { mutate: updateVoice, isPending } = useUpdateSystemVoice();

	const [selectedVoice, setSelectedVoice] = useState<string>("");

	const hasChanges = () => {
		const currentPath = Array.isArray(currentVoice) && currentVoice.length > 0 ? currentVoice[0].imagePath : "";
		return selectedVoice !== currentPath;
	};
	React.useEffect(() => {
		if (currentVoice) {
			setSelectedVoice(currentVoice[0].imagePath);
		} else if (systemVoices && systemVoices.length > 0) {
			setSelectedVoice(systemVoices[0].imagePath);
		}
	}, [currentVoice, systemVoices]);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const handleSubmit = () => {
		const selected = systemVoices?.find((voice) => voice.imagePath === selectedVoice);
		if (selected && hasChanges()) {
			console.log(selected);

			updateVoice(selected.systemVoiceId, {
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
			<div className="flex items-center justify-center self-center md:h-full md:w-[300px]">
				<img
					src={`${cdnUrl}assets/system_voice/${selectedVoice.replace(".dds", ".png")}`}
					className="w-[200px] object-contain"
					alt="System Voice"
				/>
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
									{systemVoices?.map((voice) => (
										<div
											key={voice.systemVoiceId}
											onClick={() => {
												setSelectedVoice(voice.imagePath);
											}}
											className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
										>
											<span className="text-primary min-w-[150px] truncate">{voice.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update system voice"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default SystemvoiceSelector;
