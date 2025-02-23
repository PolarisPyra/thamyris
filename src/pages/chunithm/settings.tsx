import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";
import { api } from "@/utils";
import Header from "@/components/common/header";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const ChunithmSettingsPage: React.FC<GameSettingsProps> = ({ onUpdate }) => {
	const [chunithmVersion, setChunithmVersion] = useState("");
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [versions, setVersions] = useState<string[]>([]);

	const fetchCurrentVersion = async () => {
		try {
			const response = await api.chunithm.settings.get.$get();
			if (response.ok) {
				const data = await response.json();
				setChunithmVersion(data.version);
			}
		} catch (error) {
			console.error("Error fetching current version:", error);
		}
	};

	const fetchVersions = async () => {
		try {
			const response = await api.chunithm.settings.versions.$get();
			if (response.ok) {
				const data = await response.json();
				setVersions(data.versions);
			}
		} catch (error) {
			console.error("Error fetching versions:", error);
		}
	};

	useEffect(() => {
		fetchVersions();
		fetchCurrentVersion();
	}, []);

	useEffect(() => {
		fetchCurrentVersion();
	}, []);

	const handleVersionChange = (version: string) => {
		setChunithmVersion(version);
	};

	const handleDropdownToggle = (section: string) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const updateChunithmSettings = async () => {
		try {
			const response = await api.chunithm.settings.update.$post({
				json: { version: chunithmVersion },
			});
			if (response.ok) {
				const data = await response.json();
				setChunithmVersion(data.version);
				console.log("Updated Chunithm settings to version:", data.version);
			}
			onUpdate?.();
		} catch (error) {
			console.error("Error updating Chunithm settings:", error);
		}
	};

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title={"Chunithm Settings"} />

			<motion.div
				className="flex flex-col  w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* Chunithm Section */}
				<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
					<h2 className="text-xl font-semibold text-gray-100 mb-4">Chunithm Settings</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle("chunithm-version")}
							className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
						>
							<span className="text-gray-200">Game Version: {chunithmVersion}</span>
							<ChevronDown
								className={`w-5 h-5 text-gray-400 transition-transform ${
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
									<div className="max-h-[285px] overflow-y-auto space-y-2 pr-2">
										{versions.map((version) => (
											<div
												key={version}
												onClick={() => handleVersionChange(version)}
												className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors"
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
						onClick={updateChunithmSettings}
						defaultLabel="Update Chunithm settings"
						updatingLabel="Updating..."
						className="bg-red-600 hover:bg-red-700"
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default ChunithmSettingsPage;
