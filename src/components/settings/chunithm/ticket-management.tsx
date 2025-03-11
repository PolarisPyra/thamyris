import React from "react";

import { toast } from "sonner";

import { useLimitedTickets, useUnlimitedTickets } from "@/hooks/chunithm/use-unlocks";

import { SubmitButton } from "../../common/button";

const TicketManagement = () => {
	const { mutate: enableUnlimited, isPending: isEnablingUnlimited } = useUnlimitedTickets();
	const { mutate: disableUnlimited, isPending: isDisablingUnlimited } = useLimitedTickets();

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Manage Tickets</h2>
			<div className="flex gap-4">
				<SubmitButton
					onClick={() => {
						enableUnlimited(undefined, {
							onSuccess: () => toast.success("Successfully enabled unlimited tickets"),
							onError: () => toast.error("Failed to enable unlimited tickets"),
						});
					}}
					defaultLabel="Enable Unlimited Tickets"
					updatingLabel="Enabling..."
					className="bg-green-600 hover:bg-green-700"
					disabled={isEnablingUnlimited}
				/>
				<SubmitButton
					onClick={() => {
						disableUnlimited(undefined, {
							onSuccess: () => toast.success("Successfully disabled unlimited tickets"),
							onError: () => toast.error("Failed to disable unlimited tickets"),
						});
					}}
					defaultLabel="Disable Unlimited Tickets"
					updatingLabel="Disabling..."
					className="bg-red-600 hover:bg-red-700"
					disabled={isDisablingUnlimited}
				/>
			</div>
		</div>
	);
};

export default TicketManagement;
