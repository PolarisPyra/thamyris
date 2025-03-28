import React from "react";

import { toast } from "sonner";

import { useLimitedTickets, useUnlimitedTickets } from "@/hooks/chunithm";

import { SubmitButton } from "../../common/button";

const TicketManagement = () => {
	const { mutate: enableUnlimited, isPending: isEnablingUnlimited } = useUnlimitedTickets();
	const { mutate: disableUnlimited, isPending: isDisablingUnlimited } = useLimitedTickets();

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Manage Tickets</h2>
			<div className="flex gap-4">
				<SubmitButton
					onClick={() => {
						enableUnlimited(undefined, {
							onSuccess: () => toast.success("Tickets enabled successfully!"),
							onError: () => toast.error("Failed to enable tickets"),
						});
					}}
					defaultLabel="Enable Unlimited Tickets"
					updatingLabel="Enabling..."
					disabled={isEnablingUnlimited}
				/>
				<SubmitButton
					onClick={() => {
						disableUnlimited(undefined, {
							onSuccess: () => toast.success("Tickets disabled successfully!"),
							onError: () => toast.error("Failed to disable tickets"),
						});
					}}
					defaultLabel="Disable Unlimited Tickets"
					updatingLabel="Disabling..."
					className="bg-buttonlockcontent hover:bg-buttonlockcontenthover"
					disabled={isDisablingUnlimited}
				/>
			</div>
		</div>
	);
};

export default TicketManagement;
