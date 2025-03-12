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
				onSuccess: (success) => toast.success(success.message),
				onError: (error) => toast.error(error.message),
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
					onSuccess: (success) => toast.success(success.message),
					onError: (error) => toast.error(error.message),
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
					className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover text-lg"
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(17)}
					defaultLabel="Unlock costumes"
					updatingLabel="Unlocking..."
					className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover text-lg"
					disabled={isUnlocking.specific}
				/>
				<SubmitButton
					onClick={() => handleUnlockSpecificItem(19)}
					defaultLabel="Unlock attachments"
					updatingLabel="Unlocking..."
					className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover text-lg"
					disabled={isUnlocking.specific}
				/>
			</div>
			<SubmitButton
				onClick={handleUnlockAllItems}
				defaultLabel="Unlock all items"
				updatingLabel="Unlocking..."
				className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover text-lg"
				disabled={isUnlocking.items}
			/>
		</div>
	);
};

export default ItemManagement;
