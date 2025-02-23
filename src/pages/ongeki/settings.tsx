import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";
import { api } from "@/utils";
import Header from "@/components/common/header";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const OngekiSettingsPage: React.FC<GameSettingsProps> = ({ onUpdate }) => {
	const [ongekiVersion, setOngekiVersion] = useState("");
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const unlockAllItems = async () => {
		const confirmed = window.confirm("Are you sure you want to unlock all items?");
		if (!confirmed) return;

		try {
			const itemKinds = [2, 3, 17, 19];
			for (const itemKind of itemKinds) {
				const response = await api.ongeki.settings.unlockallitems.$post({
					json: { itemKind },
				});
				if (!response.ok) {
					console.error(`Failed to unlock items of kind ${itemKind}`);
					return;
				}
			}
			console.log("All items unlocked successfully");
		} catch (error) {
			console.error("Error unlocking all items:", error);
		}
	};

	const unlockSpecificItem = async (itemKind: number) => {
		const confirmed = window.confirm(`Are you sure you want to unlock item?`);
		if (!confirmed) return;

		try {
			const response = await api.ongeki.settings.unlockspecificitem.$post({
				json: { itemKind },
			});

			if (response.ok) {
				console.log(`Successfully unlocked items of kind ${itemKind}`);
			} else {
				console.error(`Failed to unlock items of kind ${itemKind}`);
			}
		} catch (error) {
			console.error(`Error unlocking items of kind ${itemKind}:`, error);
		}
	};

	const unlockAllCards = async () => {
		const confirmed = window.confirm("Are you sure you want to unlock all cards?");
		if (!confirmed) return;
		try {
			const response = await api.ongeki.settings.unlockcards.$post();
			if (response.ok) {
				console.log("All cards unlocked successfully");
			} else {
				console.error("Failed to unlock all cards");
			}
		} catch (error) {
			console.error("Error unlocking all cards:", error);
		}
	};

	const fetchCurrentVersion = async () => {
		try {
			const response = await api.ongeki.settings.get.$get();
			if (response.ok) {
				const data = await response.json();
				setOngekiVersion(data.version);
			}
		} catch (error) {
			console.error("Error fetching current version:", error);
		}
	};
	const versions = ["1", "2", "3", "4", "5", "6", "7"];

	useEffect(() => {
		fetchCurrentVersion();
	}, []);

	const handleVersionChange = (version: string) => {
		setOngekiVersion(version);
	};

	const handleDropdownToggle = (section: string) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const updateOngekiSettings = async () => {
		try {
			const response = await api.ongeki.settings.update.$post({
				json: { version: ongekiVersion },
			});
			if (response.ok) {
				const data = await response.json();
				setOngekiVersion(data.version);
				console.log("Updated Ongeki settings to version:", data.version);
			}
			onUpdate?.();
		} catch (error) {
			console.error("Error updating Ongeki settings:", error);
		}
	};

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title={"Ongeki Settings"} />
			<motion.div
				className="flex flex-col w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* Ongeki Section */}
				<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
					<h2 className="text-xl font-semibold text-gray-100 mb-4">Ongeki Settings</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle("ongeki-version")}
							className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
						>
							<span className="text-gray-200">Game Version: {ongekiVersion}</span>
							<ChevronDown
								className={`w-5 h-5 text-gray-400 transition-transform ${
									openDropdown === "ongeki-version" ? "rotate-180" : ""
								}`}
							/>
						</button>

						<AnimatePresence>
							{openDropdown === "ongeki-version" && (
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
						onClick={updateOngekiSettings}
						defaultLabel="Update Ongeki settings"
						updatingLabel="Updating..."
						className="text-lg bg-red-600 hover:bg-red-700"
					/>
				</div>
				<div className="bg-gray-800  bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
					<h2 className="text-xl font-semibold text-gray-100 mb-4">Card Management</h2>

					<SubmitButton
						onClick={unlockAllCards}
						defaultLabel="Unlock all cards"
						updatingLabel="Unlocking..."
						className="bg-red-600 hover:bg-red-700 text-lg "
					/>
				</div>
				<div className="bg-gray-800  bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700">
					<h2 className="text-xl font-semibold text-gray-100 ">Item Management</h2>

					<div className="grid grid-cols-3 gap-4">
						<SubmitButton
							onClick={() => unlockSpecificItem(2)}
							defaultLabel="Unlock nameplates"
							updatingLabel="Unlocking..."
							className="bg-blue-400 hover:bg-blue-500 text-lg"
						/>

						<SubmitButton
							onClick={() => unlockSpecificItem(17)}
							defaultLabel="Unlock costumes"
							updatingLabel="Unlocking..."
							className="bg-blue-400 hover:bg-blue-500 text-lg"
						/>
						<SubmitButton
							onClick={() => unlockSpecificItem(19)}
							defaultLabel="Unlock costume attachments"
							updatingLabel="Unlocking..."
							className="bg-blue-400 hover:bg-blue-500 text-lg"
						/>
					</div>
					<SubmitButton
						onClick={unlockAllItems}
						defaultLabel="Unlock all items"
						updatingLabel="Unlocking..."
						className="bg-red-600 hover:bg-red-700 text-lg"
					/>
					<h2 className="text-xl font-semibold text-gray-100  mt-2">Achievement Management</h2>

					<SubmitButton
						onClick={() => unlockSpecificItem(3)}
						defaultLabel="Unlock titles"
						updatingLabel="Unlocking..."
						className="bg-red-600 hover:bg-red-700 text-lg"
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default OngekiSettingsPage;
