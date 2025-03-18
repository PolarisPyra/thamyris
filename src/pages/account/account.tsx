import React from "react";

import KeychipGenerator from "@/components/admin/keychip-generator";
import Header from "@/components/common/header";
import AimeCardSwap from "@/components/settings/common/aime-card";
import { useAdmin } from "@/hooks/admin";

const Account = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
	return (
		<div className="overflow-autop relative flex-1">
			<Header title={isAdmin ? "Admin Dashboard" : "Account Dashboard"} />
			<div className="mx-auto max-w-2xl space-y-6">
				{isCheckingAdmin ? (
					<div className="rounded-lg bg-gray-800 p-6 shadow-md">
						<p className="text-center">Checking permissions...</p>
					</div>
				) : (
					<>
						{isAdmin && <KeychipGenerator />}
						{!isAdmin}
						<div className="mx-auto max-w-2xl space-y-6">
							<AimeCardSwap />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Account;
