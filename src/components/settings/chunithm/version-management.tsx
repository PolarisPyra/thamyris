import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useChunithmVersion, useChunithmVersions, useUpdateChunithmVersion } from "@/hooks/chunithm/use-version";

import { SubmitButton } from "../../common/button";

const VersionManagement = () => {
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const { mutate: updateVersion, isPending } = useUpdateChunithmVersion();
	const { data: chunithmVersion } = useChunithmVersion();
	const { data: versions } = useChunithmVersions();

	const getGameTitle = (version: number | undefined): string => {
		if (!version) return "Select a version";

		const versionMap: Record<number, string> = {
			11: "Chunithm New",
			12: "Chunithm New Plus",
			13: "Chunithm Sun",
			14: "Chunithm Sun Plus",
			15: "Chunithm Luminous",
			16: "Chunithm Luminous Plus",
			17: "Chunithm Verse",
		};

		return versionMap[version] || `Version ${version}`;
	};

	const handleVersionChange = (version: number) => {
		setSelectedVersion(version);
		setOpenDropdown(null);
	};

	const handleDropdownToggle = (section: number) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const handleUpdate = () => {
		if (!selectedVersion) {
			toast.error("Please select a version first");
			return;
		}

		updateVersion(selectedVersion.toString(), {
			onSuccess: () => {
				toast.success("Successfully updated game version");
			},
			onError: () => {
				toast.error("Failed to update game version");
			},
		});
	};

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Set Chunithm version</h2>

			<div className="mb-4">
				<button
					onClick={() => handleDropdownToggle(0)}
					className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
				>
					<span className="text-gray-200">{getGameTitle(selectedVersion || chunithmVersion)}</span>
					<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === 0 ? "rotate-180" : ""}`} />
				</button>

				<AnimatePresence>
					{openDropdown === 0 && (
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
				defaultLabel="Update Chunithm settings"
				updatingLabel="Updating..."
				className="bg-red-600 hover:bg-red-700"
				disabled={isPending || !selectedVersion}
			/>
		</div>
	);
};

export default VersionManagement;
