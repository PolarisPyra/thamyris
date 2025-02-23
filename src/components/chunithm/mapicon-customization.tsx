import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/utils";
import { SubmitButton } from "@/components/common/button";
import { toast } from "sonner";

interface mapIcon {
	id: number;
	name: string;
	imagePath: string;
}

const MapiconSelector = () => {
	const [mapIcons, setmapIcons] = useState<mapIcon[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedmapIcon, setSelectedmapIcon] = useState<string>("");
	const [openDropdown, setOpenDropdown] = useState(false);

	const handleDropdownToggle = () => {
		setOpenDropdown(!openDropdown);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const currentResponse = await api.chunithm.mapicon.current.$get();
				if (currentResponse.ok) {
					const currentData = await currentResponse.json();
					const currentmapIcon = currentData.results[0];
					if (currentmapIcon) {
						setSelectedmapIcon(currentmapIcon.imagePath.replace(".dds", ".png"));
					}

					const allResponse = await api.chunithm.mapicon.all.$get();
					if (allResponse.ok) {
						const allData = await allResponse.json();
						const convertedmapIcons = allData.results.map((mapIcon: mapIcon) => ({
							...mapIcon,
							imagePath: mapIcon.imagePath.replace(".dds", ".png"),
						}));

						setmapIcons(convertedmapIcons);

						if (!currentmapIcon && convertedmapIcons.length > 0) {
							setSelectedmapIcon(convertedmapIcons[0].imagePath);
						}
					}
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
				toast.error("Error loading map icons");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSubmit = async () => {
		try {
			const selected = mapIcons.find((mapIcon) => mapIcon.imagePath === selectedmapIcon);

			if (selected) {
				const response = await api.chunithm.mapicon.update.$post({
					json: { mapIconId: selected.id },
				});

				if (!response.ok) {
					toast.error("Failed to update map icon");
					throw new Error("Failed to update map icon");
				}
				toast.success("Map icon updated successfully!");
			}
		} catch (error) {
			console.error("Error updating map icon:", error);
			toast.error("Error updating map icon");
		}
	};

	const getSelectedLabel = () => {
		const selected = mapIcons.find((mapIcon) => mapIcon.imagePath === selectedmapIcon);
		return selected?.name || "Select Map Icon";
	};

	if (isLoading) {
		return <div>Loading map icons...</div>;
	}

	return (
		<motion.div
			className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
		>
			<div className="relative w-full md:w-[300px] h-[100px] flex justify-center items-center">
				<img
					src={`/assets/map_icon/${selectedmapIcon}`}
					alt="Selected map icon"
					className="w-[150px] object-contain"
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
									{mapIcons.map((mapIcon) => (
										<div
											key={mapIcon.id}
											onClick={() => {
												setSelectedmapIcon(mapIcon.imagePath);
											}}
											className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors overflow-x-hidden"
										>
											<span className="text-gray-200 min-w-[150px] truncate">{mapIcon.name}</span>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update Map Icon"
					updatingLabel="Updating..."
				/>
			</div>
		</motion.div>
	);
};

export default MapiconSelector;
