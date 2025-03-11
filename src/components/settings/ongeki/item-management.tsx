import React, { useState } from "react";

import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useUnlockAllItems, useUnlockSpecificItem } from "@/hooks/ongeki/use-unlocks";
import { useOngekiVersion } from "@/hooks/ongeki/use-version";

const ItemManagement = () => {
	const { data: ongekiVersion } = useOngekiVersion();

	const { mutate: unlockAllItems } = useUnlockAllItems();
	const { mutate: unlockSpecificItem } = useUnlockSpecificItem();

	const [isUnlocking, setIsUnlocking] = useState<{ [key: string]: boolean }>({
		cards: false,
		items: false,
		specific: false,
	});

	const handleUnlockAllItems = async () => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, items: true }));
		try {
			unlockAllItems(ongekiVersion, {
				onSuccess: () => {
					toast.success("Successfully unlocked all items");
				},
				onError: () => {
					toast.error("Failed to unlock items");
				},
			});
		} finally {
			setIsUnlocking((prev) => ({ ...prev, items: false }));
		}
	};

	const handleUnlockSpecificItem = async (itemKind: number) => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, specific: true }));
		try {
			unlockSpecificItem(
				{ itemKind, version: ongekiVersion },
				{
					onSuccess: () => {
						toast.success("Successfully unlocked items");
					},
					onError: () => {
						toast.error("Failed to unlock items");
					},
				}
			);
		} finally {
			setIsUnlocking((prev) => ({ ...prev, specific: false }));
		}
	};
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="text-xl font-semibold text-gray-100">Item Management</h2>
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(2)}
					defaultLabel="Unlock nameplates"
					updatingLabel="Unlocking..."
					className="bg-blue-400 text-lg hover:bg-blue-500"
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(17)}
					defaultLabel="Unlock costumes"
					updatingLabel="Unlocking..."
					className="bg-blue-400 text-lg hover:bg-blue-500"
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(19)}
					defaultLabel="Unlock attachments"
					updatingLabel="Unlocking..."
					className="bg-blue-400 text-lg hover:bg-blue-500"
					disabled={isUnlocking.specific}
				/>
			</div>
			<SubmitButton
				onClick={handleUnlockAllItems}
				defaultLabel="Unlock all items"
				updatingLabel="Unlocking..."
				className="bg-red-600 text-lg hover:bg-red-700"
				disabled={isUnlocking.items}
			/>
		</div>
	);
};

export default ItemManagement;
