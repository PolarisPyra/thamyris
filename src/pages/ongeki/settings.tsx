import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SubmitButton } from "@/components/common/button";
import Header from "@/components/common/header";
import { api } from "@/utils";

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
		<div className="relative flex-1 overflow-auto">
			<Header title={"Ongeki Settings"} />
			<motion.div
				className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{/* Ongeki Section */}
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Ongeki Settings</h2>

					<div className="mb-4">
						<button
							onClick={() => handleDropdownToggle("ongeki-version")}
							className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
						>
							<span className="text-gray-200">Game Version: {ongekiVersion}</span>
							<ChevronDown
								className={`h-5 w-5 text-gray-400 transition-transform ${
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
									<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
										{versions.map((version) => (
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
						onClick={updateOngekiSettings}
						defaultLabel="Update Ongeki settings"
						updatingLabel="Updating..."
						className="bg-red-600 text-lg hover:bg-red-700"
					/>
				</div>
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="mb-4 text-xl font-semibold text-gray-100">Card Management</h2>

					<SubmitButton
						onClick={unlockAllCards}
						defaultLabel="Unlock all cards"
						updatingLabel="Unlocking..."
						className="bg-red-600 text-lg hover:bg-red-700"
					/>
				</div>
				<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
					<h2 className="text-xl font-semibold text-gray-100">Item Management</h2>

					<div className="grid grid-cols-3 gap-4">
						<SubmitButton
							onClick={() => unlockSpecificItem(2)}
							defaultLabel="Unlock nameplates"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
						/>

						<SubmitButton
							onClick={() => unlockSpecificItem(17)}
							defaultLabel="Unlock costumes"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
						/>
						<SubmitButton
							onClick={() => unlockSpecificItem(19)}
							defaultLabel="Unlock costume attachments"
							updatingLabel="Unlocking..."
							className="bg-blue-400 text-lg hover:bg-blue-500"
						/>
					</div>
					<SubmitButton
						onClick={unlockAllItems}
						defaultLabel="Unlock all items"
						updatingLabel="Unlocking..."
						className="bg-red-600 text-lg hover:bg-red-700"
					/>
					<h2 className="mt-2 text-xl font-semibold text-gray-100">Achievement Management</h2>

					<SubmitButton
						onClick={() => unlockSpecificItem(3)}
						defaultLabel="Unlock titles"
						updatingLabel="Unlocking..."
						className="bg-red-600 text-lg hover:bg-red-700"
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default OngekiSettingsPage;
