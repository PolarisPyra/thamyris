import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitButton } from "@/components/common/button";

import { toast } from "sonner";
import { useCurrentAvatar, useAllAvatarParts, useUpdateAvatar } from "@/hooks/use-avatar";
import Spinner from "../common/spinner";
import { cdnUrl } from "@/lib/cdn";
import { avatarData } from "@/utils/types";

interface AvatarDropdownProps {
	category: string;
	options: avatarData[];
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
			className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
		>
			<span className="text-gray-200 truncate">{getSelectedLabel(category)}</span>
			<ChevronDown
				className={`w-5 h-5 text-gray-400 transition-transform ${
					openDropdown === category ? "rotate-180" : ""
				}`}
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
					<div className="max-h-[285px] overflow-y-auto space-y-2 pr-2">
						{options?.map((item) => (
							<div
								key={item.avatarAccessoryId}
								onClick={() => {
									handleChange(category, item.image);
								}}
								className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors overflow-x-hidden"
							>
								<span className="text-gray-200 min-w-[150px] truncate">{item.label}</span>
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

	const handleSubmit = () => {
		if (!availableAccessories) return;
		const avatarParts = {
			head:
				availableAccessories.head?.find((item) => item.image === selectedAccessories.head)
					?.avatarAccessoryId || 0,
			face:
				availableAccessories.face?.find((item) => item.image === selectedAccessories.face)
					?.avatarAccessoryId || 0,
			back:
				availableAccessories.back?.find((item) => item.image === selectedAccessories.back)
					?.avatarAccessoryId || 0,
			wear:
				availableAccessories.wear?.find((item) => item.image === selectedAccessories.wear)
					?.avatarAccessoryId || 0,
			item:
				availableAccessories.item?.find((item) => item.image === selectedAccessories.item)
					?.avatarAccessoryId || 0,
		};

		updateAvatar(avatarParts, {
			onSuccess: () => {
				toast.success("Avatar updated successfully");
				setOpenDropdown(null);
			},
			onError: () => {
				toast.error("Error updating avatar");
			},
		});
	};

	if (isLoadingCurrent || isLoadingParts) {
		return (
			<div className="flex justify-center items-center h-[400px]">
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row justify-center w-full pt-4 md:pt-15 gap-4 md:gap-8 px-4">
			<div className="relative w-full md:w-[300px] h-[300px] md:h-[400px] mb-6 md:mb-0">
				<div className="avatar_base relative w-[300px] h-[400px]">
					<div className="avatar_back">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.back}.png`} />
					</div>
					<div className="avatar_wear">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.wear}.png`} />
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
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.head}.png`} />
					</div>
					<div className="avatar_face_static">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_Face.png`} />
					</div>
					<div className="avatar_face">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.face}.png`} />
					</div>
					<div className="avatar_item_l">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.item}.png`} />
					</div>
					<div className="avatar_item_r">
						<img loading="lazy" src={`${cdnUrl}assets/avatar/${selectedAccessories.item}.png`} />
					</div>
					<div className="avatar_skinfoot_l">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
					</div>
					<div className="avatar_skinfoot_r">
						<img src={`${cdnUrl}assets/avatarStatic/CHU_UI_Avatar_Tex_01400001.png`} />
					</div>
				</div>
			</div>

			<div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 md:p-6 border border-gray-700 w-full md:w-[400px]">
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
					defaultLabel="Update Avatar"
					updatingLabel="Updating..."
					disabled={isPending}
				/>
			</div>
		</div>
	);
};

export default PenguinDressup;
