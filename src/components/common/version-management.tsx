import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";

interface VersionManagementProps {
	title: string;
	currentVersion: number | undefined;
	availableVersions: number[] | undefined;
	isUpdating: boolean;
	onUpdateVersion: (version: string) => void;
	versions: Record<number, string>;
	buttonLabel?: string;
	updatingLabel?: string;
}

const VersionManagement: React.FC<VersionManagementProps> = ({
	title,
	currentVersion,
	availableVersions,
	isUpdating,
	onUpdateVersion,
	versions,
	buttonLabel = "Update settings",
	updatingLabel = "Updating...",
}) => {
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);

	const getGameTitle = (version: number | undefined): string => {
		if (!version) return "Select a version";
		return versions[version] || `Version ${version}`;
	};

	const handleVersionChange = (version: number) => {
		setSelectedVersion(version);
		setOpenDropdown(false);
	};

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	const handleUpdate = () => {
		if (!selectedVersion) {
			toast.error("Please select a version first");
			return;
		}

		onUpdateVersion(selectedVersion.toString());
	};

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">{title}</h2>

			<div className="mb-4">
				<button
					onClick={handleDropdownToggle}
					className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
				>
					<span className="text-gray-200">{getGameTitle(selectedVersion || currentVersion)}</span>
					<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
				</button>

				<AnimatePresence>
					{openDropdown && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-2"
						>
							<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
								{availableVersions?.map((version) => (
									<div
										key={version}
										onClick={() => handleVersionChange(version)}
										className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
									>
										<span className="text-gray-200">{getGameTitle(version)}</span>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<SubmitButton
				onClick={handleUpdate}
				defaultLabel={buttonLabel}
				updatingLabel={updatingLabel}
				className="bg-red-600 text-lg hover:bg-red-700"
				disabled={isUpdating || !selectedVersion}
			/>
		</div>
	);
};

export default VersionManagement;
