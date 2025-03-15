import React, { useState } from "react";

import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import { useOngekiVersion, useUnlockAllCards } from "@/hooks/ongeki";

const CardManagement = () => {
	const { mutate: unlockAllCards } = useUnlockAllCards();
	const { data: ongekiVersion } = useOngekiVersion();

	const [isUnlocking, setIsUnlocking] = useState<{ [key: string]: boolean }>({
		cards: false,
		items: false,
		specific: false,
	});

	const handleUnlockAllCards = async () => {
		if (!ongekiVersion) return;

		setIsUnlocking((prev) => ({ ...prev, cards: true }));
		try {
			unlockAllCards(ongekiVersion, {
				onSuccess: () => {
					toast.success("Cards unlocked successfully!");
				},
				onError: () => {
					toast.error("Failed to unlock cards");
				},
			});
		} finally {
			setIsUnlocking((prev) => ({ ...prev, cards: false }));
		}
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Card Management</h2>
			<SubmitButton
				onClick={handleUnlockAllCards}
				defaultLabel="Unlock all cards"
				updatingLabel="Unlocking..."
				disabled={isUnlocking.cards}
			/>
		</div>
	);
};

export default CardManagement;
