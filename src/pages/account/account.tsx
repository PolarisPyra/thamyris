import React from "react";

import KeychipGenerator from "@/components/admin/keychip-generator";
import Header from "@/components/common/header";
import { useAdminPermissions } from "@/hooks/admin/use-admin";

const Account = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAdminPermissions();

	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={isAdmin ? "Admin Dashboard" : "Account Dashboard"} />
			<div className="p-6">
				<div className="mx-auto max-w-2xl">
					{isCheckingAdmin ? (
						<div className="rounded-lg bg-gray-800 p-6 shadow-md">
							<p className="text-center">Checking permissions...</p>
						</div>
					) : (
						<>
							{isAdmin && <KeychipGenerator />}

							{!isAdmin && (
								<div className="rounded-lg bg-gray-800 p-6 shadow-md">
									<h2 className="mb-4 text-xl font-semibold">Account Settings</h2>
									<p className="text-gray-400">Account management features coming soon...</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Account;
