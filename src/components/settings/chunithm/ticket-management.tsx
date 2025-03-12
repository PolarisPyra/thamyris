import React from "react";

import { toast } from "sonner";

import { useLimitedTickets, useUnlimitedTickets } from "@/hooks/chunithm/use-unlocks";

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
							onSuccess: (success) => toast.success(success.message),
							onError: (error) => toast.error(error.message),
						});
					}}
					defaultLabel="Enable Unlimited Tickets"
					updatingLabel="Enabling..."
					className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover"
					disabled={isEnablingUnlimited}
				/>
				<SubmitButton
					onClick={() => {
						disableUnlimited(undefined, {
							onSuccess: (success) => toast.success(success.message),
							onError: (error) => toast.error(error.message),
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
