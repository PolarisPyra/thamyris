import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useAllAvatarParts, useCurrentAvatar, useUpdateAvatar } from "@/hooks/chunithm";
import { cdnUrl } from "@/lib/constants";
import { AvatarParts } from "@/types";

import Spinner from "../common/spinner";

interface AvatarDropdownProps {
	category: string;
	options: { image: string; label: string; avatarAccessoryId: number }[];
	openDropdown: string | null;
	handleDropdownToggle: (part: string) => void;
	handleChange: (part: string, image: string) => void;
	getSelectedLabel: (part: string) => string;
}

const AvatarDropdown = ({
	category,
	options,
	openDropdown,
	handleDropdownToggle,
	handleChange,
	getSelectedLabel,
}: AvatarDropdownProps) => (
	<div className="mb-4">
		<button
			onClick={() => handleDropdownToggle(category)}
			className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-lg p-3 transition-colors"
		>
			<span className="text-primary truncate">{getSelectedLabel(category)}</span>
			<ChevronDown
				className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === category ? "rotate-180" : ""}`}
			/>
		</button>
		<AnimatePresence>
			{openDropdown === category && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-2 overflow-hidden"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
						{options?.map((item) => (
							<div
								key={item.avatarAccessoryId}
								onClick={() => {
									handleChange(category, item.image);
								}}
								className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
							>
								<span className="text-primary min-w-[150px] truncate">{item.label}</span>
							</div>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	</div>
);
const PenguinDressup = () => {
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
		const accessory = availableAccessories?.[part as keyof typeof availableAccessories] || [];
		const selectedAccessory = accessory.find((accessory) => accessory.image === selectedValue);
		return selectedAccessory?.label || `Select ${part}`;
	};

	const toggleDropdown = (part: string) => {
		setOpenDropdown(openDropdown === part ? null : part);
	};

	const hasChanges = () => {
		if (!currentAvatar) return false;
		return Object.keys(selectedAccessories).some(
			(key) =>
				selectedAccessories[key as keyof typeof selectedAccessories] !== currentAvatar[key as keyof typeof currentAvatar]
		);
	};

	const handleSubmit = () => {
		if (!availableAccessories) return;
		const avatarParts: Partial<AvatarParts> = {
			head: availableAccessories.head?.find((item) => item.image === selectedAccessories.head)?.avatarAccessoryId || 0,
			face: availableAccessories.face?.find((item) => item.image === selectedAccessories.face)?.avatarAccessoryId || 0,
			back: availableAccessories.back?.find((item) => item.image === selectedAccessories.back)?.avatarAccessoryId || 0,
			wear: availableAccessories.wear?.find((item) => item.image === selectedAccessories.wear)?.avatarAccessoryId || 0,
			item: availableAccessories.item?.find((item) => item.image === selectedAccessories.item)?.avatarAccessoryId || 0,
		};

		updateAvatar(avatarParts as AvatarParts, {
			onSuccess: () => {
				toast.success("Avatar updated successfully");
				setOpenDropdown(null);
			},
			onError: () => {
				console.log(avatarParts);

				toast.error("Error updating avatar");
			},
		});
	};

	if (isLoadingCurrent || isLoadingParts) {
		return (
			<div className="flex h-[400px] items-center justify-center">
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="z-0 flex w-full flex-col justify-center gap-4 px-4 pt-4 md:flex-row md:gap-8 md:pt-15">
			<div className="relative mb-6 h-[300px] w-full md:mb-0 md:h-[400px] md:w-[300px]">
				<div className="avatar_base relative h-[400px] w-[300px]">
					<div className="avatar_back">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.back}.png`} />
					</div>
					<div className="avatar_wear">
						<img src={`${cdnUrl}assets/avatar/${selectedAccessories.wear}.png`} />
					</div>
					<div className="avatar_skin">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
					</div>
					<div className="avatar_hand_l">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_LeftHand.png`} />
					</div>
					<div className="avatar_hand_r">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_RightHand.png`} />
					</div>
					<div className="avatar_head">
						<img src={`${cdnUrl}assets/avatar/${selectedAccessories.head}.png`} />
					</div>
					<div className="avatar_face_static">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_Face.png`} />
					</div>
					<div className="avatar_face">
						<img src={`${cdnUrl}assets/avatar/${selectedAccessories.face}.png`} />
					</div>
					<div className="avatar_item_l">
						<img src={`${cdnUrl}assets/avatar/${selectedAccessories.item}.png`} />
					</div>
					<div className="avatar_item_r">
						<img src={`${cdnUrl}assets/avatar/${selectedAccessories.item}.png`} />
					</div>
					<div className="avatar_skinfoot_l">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
					</div>
					<div className="avatar_skinfoot_r">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
					</div>
				</div>
			</div>

			<div className="bg-card w-full rounded-md p-4 md:w-[400px] md:p-6">
				{Object.entries(availableAccessories || {}).map(([category, options]) => (
					<AvatarDropdown
						key={category}
						category={category}
						options={options}
						openDropdown={openDropdown}
						handleDropdownToggle={toggleDropdown}
						handleChange={handleAccessoryChange}
						getSelectedLabel={getAccessoryLabel}
					/>
				))}
				<SubmitButton
					onClick={handleSubmit}
					defaultLabel="Update avatar"
					updatingLabel="Updating..."
					disabled={isPending || !hasChanges()}
				/>
			</div>
		</div>
	);
};

export default PenguinDressup;
