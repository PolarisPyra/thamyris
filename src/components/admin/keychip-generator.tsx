import React, { useState } from "react";
import { api } from "@/utils";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
		{ value: "aime", label: "Sega (Aime Card)" },
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
		<div className="bg-gray-800 p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Keychip Generator</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Arcade Nickname</label>
					<input
						type="text"
						name="arcade_nickname"
						value={formData.arcade_nickname}
						onChange={handleChange}
						className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Arcade Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Game Type</label>
					<button
						type="button"
						onClick={() => setOpenDropdown(!openDropdown)}
						className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
					>
						<span className="text-gray-200 truncate">
							{gameOptions.find((opt) => opt.value === formData.game)?.label || "Select Game Type"}
						</span>
						<ChevronDown
							className={`w-5 h-5 text-gray-400 transition-transform ${openDropdown ? "rotate-180" : ""}`}
						/>
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
											className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer"
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
					<label className="block text-sm font-medium mb-1">
						{showNamcoPcbId ? "Namco PCBID" : "Aime Card"}
					</label>
					<input
						type="text"
						name={showNamcoPcbId ? "namcopcbid" : "aimecard"}
						value={showNamcoPcbId ? formData.namcopcbid : formData.aimecard}
						onChange={handleChange}
						className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						required
						readOnly
					/>
				</div>

				<button
					type="button"
					onClick={generateRandomSerial}
					disabled={isLoading}
					className="w-full p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
				>
					Generate Random Serial Number
				</button>

				<button
					type="submit"
					disabled={isLoading || !hasSerialId}
					className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
				>
					{isLoading ? "Generating..." : "Generate Keychip"}
				</button>
			</form>
		</div>
	);
};

export default KeychipGenerator;
