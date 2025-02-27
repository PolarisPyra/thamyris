import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SubmitButton } from "@/components/common/button";
import Header from "@/components/common/header";
import { useChunithmVersion, useChunithmVersions, useUpdateChunithmVersion } from "@/hooks/chunithm/use-version";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const ChunithmSettingsPage: React.FC<GameSettingsProps> = ({ onUpdate }) => {
	const { data: chunithmVersion } = useChunithmVersion();
	const { data: versions } = useChunithmVersions();
	const { mutate: updateVersion, isPending } = useUpdateChunithmVersion();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [selectedVersion, setSelectedVersion] = useState("");

	const handleVersionChange = (version: string) => {
		setSelectedVersion(version);
	};

	const handleDropdownToggle = (section: string) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const handleUpdate = () => {
		updateVersion(selectedVersion, {
			onSuccess: () => {
				console.log("Updated Chunithm settings to version:", selectedVersion);
				onUpdate?.();
			},
			onError: (error) => {
				console.error("Error updating Chunithm settings:", error);
			},
		});
	};

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Chunithm Settings"} />

			<motion.div
				className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Chunithm Settings</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle("chunithm-version")}
							className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
						>
							<span className="text-gray-200">Game Version: {chunithmVersion}</span>
							<ChevronDown
								className={`h-5 w-5 text-gray-400 transition-transform ${
									openDropdown === "chunithm-version" ? "rotate-180" : ""
								}`}
							/>
						</button>

						<AnimatePresence>
							{openDropdown === "chunithm-version" && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="mt-2"
								>
									<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
										{versions?.map((version) => (
											<div
												key={version}
												onClick={() => handleVersionChange(version)}
												className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
											>
												<span className="text-gray-200">Version {version}</span>
											</div>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<SubmitButton
						onClick={handleUpdate}
						defaultLabel="Update Chunithm settings"
						updatingLabel="Updating..."
						className="bg-red-600 hover:bg-red-700"
						disabled={isPending}
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default ChunithmSettingsPage;
