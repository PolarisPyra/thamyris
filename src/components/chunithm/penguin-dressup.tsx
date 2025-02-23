import React, { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/utils";
import { SubmitButton } from "@/components/common/button";
import { AvatarImage } from "./avatar-image";
import { avatarData } from "@/utils/types";
import { useFetchAvatarData } from "@/hooks/use-get-avatar";
import { AccessoryDropdown } from "./avatar-dropdown";
import { toast } from "sonner";

interface PenguinCustomizerProps {
	onUpdate?: () => void;
}

const PenguinDressup = ({ onUpdate }: PenguinCustomizerProps) => {
	const [selectedAccessories, setSelectedAccessories] = useState({
		head: "",
		back: "",
		wear: "",
		face: "",
		item: "",
	});

	const [availableAccessories, setAvailableAccessories] = useState({
		head: [] as avatarData[],
		back: [] as avatarData[],
		wear: [] as avatarData[],
		face: [] as avatarData[],
		item: [] as avatarData[],
	});

	const [initialSelectedAccessories, setInitialSelectedAccessories] = useState({
		head: "",
		back: "",
		wear: "",
		face: "",
		item: "",
	});

	const [isLoading, setIsLoading] = useState(true);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [wasChanged, setWasChanged] = useState(false);

	useFetchAvatarData(
		setSelectedAccessories,
		setInitialSelectedAccessories,
		setAvailableAccessories,
		setIsLoading,
		availableAccessories
	);

	const handleAccessoryChange = (part: string, image: string) => {
		if (!wasChanged) {
			setWasChanged(true);
		}
		setSelectedAccessories((prev) => ({ ...prev, [part]: image }));
	};

	const getAccessoryLabel = (part: string) => {
		const selectedValue = selectedAccessories[part as keyof typeof selectedAccessories];
		const partOptions = availableAccessories[part as keyof typeof availableAccessories];
		const selectedAccessory = partOptions.find((option) => option.image === selectedValue);
		return selectedAccessory?.label || part;
	};

	const toggleDropdown = (part: string) => {
		setOpenDropdown(openDropdown === part ? null : part);
	};

	const updateAvatar = async () => {
		const hasChanged = Object.keys(selectedAccessories).some(
			(key) =>
				selectedAccessories[key as keyof typeof selectedAccessories] !==
				initialSelectedAccessories[key as keyof typeof initialSelectedAccessories]
		);

		if (!hasChanged) return;

		try {
			const avatarParts = {
				head:
					availableAccessories.head.find((item) => item.image === selectedAccessories.head)
						?.avatarAccessoryId || 0,
				face:
					availableAccessories.face.find((item) => item.image === selectedAccessories.face)
						?.avatarAccessoryId || 0,
				back:
					availableAccessories.back.find((item) => item.image === selectedAccessories.back)
						?.avatarAccessoryId || 0,
				wear:
					availableAccessories.wear.find((item) => item.image === selectedAccessories.wear)
						?.avatarAccessoryId || 0,
				item:
					availableAccessories.item.find((item) => item.image === selectedAccessories.item)
						?.avatarAccessoryId || 0,
			};

			const response = await api.chunithm.avatar.update.$post({
				json: {
					userId: 10000,
					avatarParts,
				},
			});

			if (response.ok) {
				toast.success("Avatar updated successfully");
				setInitialSelectedAccessories(selectedAccessories);

				onUpdate?.();
			} else {
				console.error("Failed to update avatar");
			}
		} catch (error) {
			toast.error("Error updating avatar");
		}
	};

	if (isLoading) {
		return <div>Loading avatar...</div>;
	}

	return (
		<motion.div
			className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1 }}
		>
			<AvatarImage clothing={selectedAccessories} />
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700 w-full md:w-[400px]">
				{Object.entries(availableAccessories).map(([accessoryType, values]) => {
					const key = values.map((item) => item.avatarAccessoryId).join("-");
					console.log(`Accessories: ${accessoryType}`, JSON.stringify(values, null, 2));
					return (
						<AccessoryDropdown
							key={key}
							accessoryType={accessoryType}
							options={values}
							openDropdown={openDropdown}
							handleDropdownToggle={toggleDropdown}
							handleChange={handleAccessoryChange}
							getSelectedLabel={getAccessoryLabel}
						/>
					);
				})}
				<SubmitButton onClick={updateAvatar} defaultLabel="Update Avatar" updatingLabel="Updating..." />
			</div>
		</motion.div>
	);
};

export default PenguinDressup;
