import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/utils";

const KeychipGenerator = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const [formData, setFormData] = useState({
		arcade_nickname: "",
		name: "",
		game: "aime",
		namcopcbid: "",
		aimecard: "",
	});

	// Determine which ID field to show based on game type
	const showNamcoPcbId = formData.game === "SDEW";
	const hasSerialId = showNamcoPcbId ? !!formData.namcopcbid : !!formData.aimecard;

	const gameOptions = [
		{ value: "aime", label: "Sega (Aime card)" },
		{ value: "SDEW", label: "SDEW (Namco PCB)" },
	];

	const handleChange = (e: { target: { name: string; value: string } }) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleGameChange = (value: string) => {
		setFormData((data) => ({
			...data,
			game: value,
			namcopcbid: "",
			aimecard: "",
		}));
		setOpenDropdown(false);
	};

	const generateRandomSerial = () => {
		let uniqueNumbers = "";
		while (uniqueNumbers.length < 4) {
			const digit = Math.floor(Math.random() * 10);
			if (!uniqueNumbers.includes(digit.toString())) {
				uniqueNumbers += digit;
			}
		}
		const randomNumbers = Math.floor(1000 + Math.random() * 9000);
		const randomSerial = `A69E01A${uniqueNumbers}${randomNumbers}`;

		setFormData((data) => ({
			...data,
			[showNamcoPcbId ? "namcopcbid" : "aimecard"]: randomSerial,
		}));
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await api.admin.keychip.generate.$post({
				json: formData,
			});

			if (response.ok) {
				toast.success("Keychip generated successfully!");
				setFormData((data) => ({
					...data,
					arcade_nickname: "",
					name: "",
				}));
			} else {
				const errorMessage =
					response.status === 403
						? "You don't have permission to generate keychips"
						: `Failed to generate keychip: ${response.status}`;
				toast.error(errorMessage);
			}
		} catch (error) {
			console.error("Error generating keychip:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-card rounded-md p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Keychip Generator</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="text-primary mb-1 block text-sm font-medium">Arcade Nickname</label>
					<input
						type="text"
						name="arcade_nickname"
						placeholder="Enter arcade nickname"
						value={formData.arcade_nickname}
						onChange={handleChange}
						className="bg-textbox text-primary w-full rounded border p-2"
						required
					/>
				</div>

				<div>
					<label className="text-primary mb-1 block text-sm font-medium">Arcade Name</label>
					<input
						type="text"
						name="name"
						placeholder="Enter arcade name"
						value={formData.name}
						onChange={handleChange}
						className="bg-textbox text-primary w-full rounded border p-2"
						required
					/>
				</div>

				<div>
					<label className="text-primary mb-1 block text-sm font-medium">Game Type</label>
					<button
						type="button"
						onClick={() => setOpenDropdown(!openDropdown)}
						className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-lg p-3 transition-colors"
					>
						<span className="text-primary truncate">
							{gameOptions.find((opt) => opt.value === formData.game)?.label || "Select Game Type"}
						</span>
						<ChevronDown className={`text-primary h-5 w-5 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
					</button>

					<AnimatePresence>
						{openDropdown && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="mt-2 overflow-hidden"
							>
								<div className="space-y-2">
									{gameOptions.map((option) => (
										<div
											key={option.value}
											onClick={() => handleGameChange(option.value)}
											className="bg-dropdown hover:bg-dropdownhover cursor-pointer rounded-md p-2"
										>
											<span className="text-primary">{option.label}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div>
					<label className="text-primary mb-1 block text-sm font-medium">
						{showNamcoPcbId ? "Namco PCBID" : "Aime Card"}
					</label>
					<input
						type="text"
						placeholder={showNamcoPcbId ? "Enter Namco PCBID" : "Enter Aime Card"}
						name={showNamcoPcbId ? "namcopcbid" : "aimecard"}
						value={showNamcoPcbId ? formData.namcopcbid : formData.aimecard}
						onChange={handleChange}
						className="bg-textbox text-primary w-full rounded border p-2"
						required
						readOnly
					/>
				</div>

				<button
					type="button"
					onClick={generateRandomSerial}
					disabled={isLoading}
					className="bg-button hover:bg-buttonhover text-buttontext mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-80"
				>
					Generate random serial
				</button>

				<button
					type="submit"
					disabled={isLoading || !hasSerialId}
					className="bg-button hover:bg-buttonhover text-buttontext mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-80"
				>
					{isLoading ? "Generating..." : "Add new keychip"}
				</button>
			</form>
		</div>
	);
};

export default KeychipGenerator;
