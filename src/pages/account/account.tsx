import React from "react";

import KeychipGenerator from "@/components/admin/keychip-generator";
import Header from "@/components/common/header";
import AimeCardSwap from "@/components/settings/common/aime-card";
import { useAdminPermissions } from "@/hooks/admin/use-admin";

const Account = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAdminPermissions();
	const buildDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		return `${year}${month}${day}${hours}`;
	};
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={isAdmin ? "Admin Dashboard" : "Account Dashboard"} />
			<div className="p-6">
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
							<div className="text-primary absolute bottom-0 left-0 p-2">Build Date: {buildDate(env.BUILD_DATE)}</div>
						</>
					)}
				</div>
				<div className="text-primary absolute bottom-0 left-0 p-2">Build Date: {buildDate(env.BUILD_DATE)}</div>
			</div>
		</div>
	);
};

export default Account;
