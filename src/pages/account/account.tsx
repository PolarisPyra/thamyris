import KeychipGenerator from "@/components/admin/keychip-generator";
import React from "react";
import { useAdminPermissions } from "@/hooks/admin/use-admin";
import Header from "@/components/common/header";

const Account = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAdminPermissions();

	return (
		<div className="flex-1 overflow-auto relative">
			<Header title={isAdmin ? "Admin Dashboard" : "Account Dashboard"} />
			<div className="p-6">
				<div className="max-w-2xl mx-auto">
					{isCheckingAdmin ? (
						<div className="bg-gray-800 p-6 rounded-lg shadow-md">
							<p className="text-center">Checking permissions...</p>
						</div>
					) : (
						<>
							{isAdmin && <KeychipGenerator />}

							{!isAdmin && (
								<div className="bg-gray-800 p-6 rounded-lg shadow-md">
									<h2 className="text-xl font-semibold mb-4">Account Settings</h2>
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
