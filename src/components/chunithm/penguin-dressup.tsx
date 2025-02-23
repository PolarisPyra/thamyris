import React, { useState } from "react";
import { SubmitButton } from "@/components/common/button";
import { AvatarImage } from "./avatar-image";
import { AccessoryDropdown } from "./avatar-dropdown";
import { toast } from "sonner";
import { useCurrentAvatar, useAllAvatarParts, useUpdateAvatar } from "@/hooks/use-avatar";

interface PenguinCustomizerProps {
	onUpdate?: () => void;
}

const PenguinDressup = ({ onUpdate }: PenguinCustomizerProps) => {
	const { data: currentAvatar, isLoading: isLoadingCurrent } = useCurrentAvatar();
	const { data: availableAccessories, isLoading: isLoadingParts } = useAllAvatarParts();
	const { mutate: updateAvatar, isPending } = useUpdateAvatar();

	const [selectedAccessories, setSelectedAccessories] = useState({
		head: "",
		back: "",
		wear: "",
		face: "",
		item: "",
	});
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	// Set initial selected accessories when data loads
	React.useEffect(() => {
		if (currentAvatar) {
			setSelectedAccessories(currentAvatar);
		}
	}, [currentAvatar]);

	const handleAccessoryChange = (part: string, image: string) => {
		setSelectedAccessories((prev) => ({ ...prev, [part]: image }));
	};

	const getAccessoryLabel = (part: string) => {
		const selectedValue = selectedAccessories[part as keyof typeof selectedAccessories];
		const partOptions = availableAccessories?.[part as keyof typeof availableAccessories] || [];
		const selectedAccessory = partOptions.find((option) => option.image === selectedValue);
		return selectedAccessory?.label || part;
	};

	const toggleDropdown = (part: string) => {
		setOpenDropdown(openDropdown === part ? null : part);
	};

	const handleSubmit = () => {
		if (!availableAccessories) return;

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

		updateAvatar(avatarParts, {
			onSuccess: () => {
				toast.success("Avatar updated successfully");
				onUpdate?.();
			},
			onError: () => {
				toast.error("Error updating avatar");
			},
		});
	};

	if (isLoadingCurrent || isLoadingParts) {
		return (
			<div className="flex justify-center items-center h-[400px]">
				<div className="text-lg text-gray-400">Loading avatar...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4">
			<AvatarImage clothing={selectedAccessories} />
			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700 w-full md:w-[400px]">
				{availableAccessories &&
					Object.entries(availableAccessories).map(([accessoryType, values]) => {
						const key = values.map((item) => item.avatarAccessoryId).join("-");
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
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update Avatar"
					updatingLabel="Updating..."
					disabled={isPending}
				/>
			</div>
		</div>
	);
};

export default PenguinDressup;
