import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";
import { toast } from "sonner";
import {
	useSystemVoices,
	useCurrentSystemVoice,
	useUpdateSystemVoice,
} from "@/hooks/use-systemvoice";
import Spinner from "../common/spinner";
import { cdnUrl } from "@/lib/cdn";

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

	const handleSubmit = () => {
		const selected = systemVoices?.find((voice) => voice.imagePath === selectedVoice);

		if (selected) {
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
		<div className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4">
			<div className="relative w-full md:w-[300px] h-[100px] flex justify-center items-center">
				<img
					loading="lazy"
					src={`${cdnUrl}assets/system_voice/${selectedVoice}`}
					className="w-[200px] object-contain"
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
									{systemVoices?.map((voice) => (
										<div
											key={voice.id}
											onClick={() => {
												setSelectedVoice(voice.imagePath);
											}}
											className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors overflow-x-hidden"
										>
											<span className="text-gray-200 min-w-[150px] truncate">{voice.name}</span>
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
					disabled={isPending}
				/>
			</div>
		</div>
	);
};

export default SystemvoiceSelector;
