import React from "react";

import KeychipGenerator from "@/components/admin/keychip-generator";
import Header from "@/components/common/header";
import AimeCardSwap from "@/components/settings/common/aime-card";
import ArcadeOwnership from "@/components/settings/common/arcade-ownership";
import { useAdmin } from "@/hooks/admin";

const Account = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
	return (
		<div className="relative flex-1 overflow-auto">
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
						<div className="mx-auto space-y-6">
							<ArcadeOwnership />

							<AimeCardSwap />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Account;
