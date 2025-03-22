import React, { useState } from "react";

import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useOngekiVersion, useUnlockAllItems, useUnlockSpecificItem } from "@/hooks/ongeki";

const ItemManagement = () => {
	const version = useOngekiVersion();

	const { mutate: unlockAllItems } = useUnlockAllItems();
	const { mutate: unlockSpecificItem } = useUnlockSpecificItem();

	const [isUnlocking, setIsUnlocking] = useState<{ [key: string]: boolean }>({
		cards: false,
		items: false,
		specific: false,
	});

	const handleUnlockAllItems = async () => {
		if (!version) return;

		setIsUnlocking((prev) => ({ ...prev, items: true }));
		try {
			unlockAllItems(version, {
				onSuccess: () => {
					toast.success("Items unlocked successfully!");
				},
				onError: () => {
					toast.error("Failed to unlock Items");
				},
			});
		} finally {
			setIsUnlocking((prev) => ({ ...prev, items: false }));
		}
	};
	const handleUnlockSpecificItem = async (itemKind: number) => {
		if (!version) return;

		setIsUnlocking((prev) => ({ ...prev, specific: true }));
		try {
			unlockSpecificItem(
				{ itemKind, version: Number(version) },
				{
					onSuccess: () => {
						toast.success("Items unlocked successfully!");
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
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary text-xl font-semibold">Item Management</h2>
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(2)}
					defaultLabel="Unlock nameplates"
					updatingLabel="Unlocking..."
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(17)}
					defaultLabel="Unlock costumes"
					updatingLabel="Unlocking..."
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(19)}
					defaultLabel="Unlock attachments"
					updatingLabel="Unlocking..."
					disabled={isUnlocking.specific}
				/>
			</div>
			<SubmitButton
				onClick={handleUnlockAllItems}
				defaultLabel="Unlock all items"
				updatingLabel="Unlocking..."
				disabled={isUnlocking.items}
			/>
		</div>
	);
};

export default ItemManagement;
