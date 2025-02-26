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

	const handleChange = (e: { target: { name: any; value: any } }) => {
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
		<div className="rounded-lg bg-gray-800 p-6 shadow-md">
			<h2 className="mb-4 text-xl font-semibold">Keychip Generator</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="mb-1 block text-sm font-medium">Arcade Nickname</label>
					<input
						type="text"
						name="arcade_nickname"
						value={formData.arcade_nickname}
						onChange={handleChange}
						className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">Arcade Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">Game Type</label>
					<button
						type="button"
						onClick={() => setOpenDropdown(!openDropdown)}
						className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
					>
						<span className="truncate text-gray-200">
							{gameOptions.find((opt) => opt.value === formData.game)?.label || "Select Game Type"}
						</span>
						<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
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
											className="cursor-pointer rounded-md bg-gray-700 p-2 hover:bg-gray-600"
										>
											<span className="text-gray-200">{option.label}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">{showNamcoPcbId ? "Namco PCBID" : "Aime Card"}</label>
					<input
						type="text"
						name={showNamcoPcbId ? "namcopcbid" : "aimecard"}
						value={showNamcoPcbId ? formData.namcopcbid : formData.aimecard}
						onChange={handleChange}
						className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
						readOnly
					/>
				</div>

				<button
					type="button"
					onClick={generateRandomSerial}
					disabled={isLoading}
					className="w-full rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600 disabled:opacity-50"
				>
					Generate random serial
				</button>

				<button
					type="submit"
					disabled={isLoading || !hasSerialId}
					className="w-full rounded bg-blue-600 p-2 transition-colors hover:bg-blue-700 disabled:opacity-50"
				>
					{isLoading ? "Generating..." : "Generate keychip"}
				</button>
			</form>
		</div>
	);
};

export default KeychipGenerator;
