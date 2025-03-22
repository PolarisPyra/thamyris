import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/button";
import Spinner from "@/components/common/spinner";
import { useArcades, useUpdateArcadeOwnership, useUsers } from "@/hooks/users/use-arcade";

const PersonalizeArcade = () => {
	const [arcadeDropdownOpen, setArcadeDropdownOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);

	const { data: arcades, isLoading: isLoadingArcades } = useArcades();
	const { data: users, isLoading: isLoadingUsers } = useUsers();

	const { mutate: updateArcade, isPending } = useUpdateArcadeOwnership();

	const [selectedArcade, setSelectedArcade] = useState<number | null>(null);
	const [selectedUser, setSelectedUser] = useState<number | null>(null);

	const hasChanges = () => {
		return selectedArcade !== null;
	};

	const handleArcadeDropdownToggle = () => {
		setArcadeDropdownOpen(!arcadeDropdownOpen);
	};

	const handleUserDropdownToggle = () => {
		setUserDropdownOpen(!userDropdownOpen);
	};

	const handleSubmit = () => {
		if (selectedArcade && selectedUser && hasChanges()) {
			// console.log("Updating arcade", selectedArcade, "with user", selectedUser);
			updateArcade(
				{ arcade: selectedArcade, user: selectedUser },
				{
					onSuccess: () => {
						toast.success("Arcade Ownership updated");
						setArcadeDropdownOpen(false);
						setUserDropdownOpen(false);
					},
					onError: (error) => {
						toast.error("Failed to update ownership");
						console.error("Error updating ownership:", error);
					},
				}
			);
		}
	};
	const getSelectedArcadeLabel = () => {
		const selected = arcades?.find((arcade) => arcade.arcade === selectedArcade);
		return selected?.name || "Select Arcade";
	};

	const getSelectedUserLabel = () => {
		if (selectedUser === null) return "Select User";
		const selected = users?.find((user) => user.id === selectedUser);
		return selected?.username || selected?.id || "";
	};

	if (isLoadingArcades || isLoadingUsers) {
		return (
			<div>
				<Spinner size={24} color="#ffffff" />
			</div>
		);
	}

	return (
		<div className="bg-card rounded-md p-6">
			<h2 className="text-primary mb-2 text-xl font-semibold">Arcade ownership settings</h2>
			<div className="text-primary mb-4 text-sm">Changes who owners a specific arcade</div>
			<div className="mb-4">
				<button
					onClick={handleArcadeDropdownToggle}
					className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
				>
					<span className="text-primary truncate">{getSelectedArcadeLabel()}</span>
					<ChevronDown className={`text-primary h-5 w-5 transition-transform ${arcadeDropdownOpen ? "rotate-180" : ""}`} />
				</button>
				<AnimatePresence>
					{arcadeDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-2 overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
								{arcades?.map((arcade) => (
									<div
										key={arcade.arcade}
										onClick={() => {
											setSelectedArcade(arcade.arcade);
											setArcadeDropdownOpen(false);
										}}
										className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
									>
										<span className="text-primary min-w-[150px] truncate">
											{arcade.name} {arcade.user}
										</span>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="mb-4">
				<button
					onClick={handleUserDropdownToggle}
					className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
				>
					<span className="text-primary truncate">{getSelectedUserLabel()}</span>
					<ChevronDown className={`text-primary h-5 w-5 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
				</button>
				<AnimatePresence>
					{userDropdownOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto", maxHeight: "285px" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-2 overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
								{users?.map((user) => (
									<div
										key={user.id}
										onClick={() => {
											setSelectedUser(user.id);
											setUserDropdownOpen(false);
										}}
										className="bg-dropdown hover:bg-dropdownhover cursor-pointer overflow-x-hidden rounded-md p-2 transition-colors"
									>
										<span className="text-primary min-w-[150px] truncate">
											{user.username
												? `${user.username}${user.access_code ? ` (${user.access_code})` : ""}`
												: `User #${user.id}${user.access_code ? ` (${user.access_code})` : ""}`}
										</span>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<SubmitButton
				onClick={handleSubmit}
				defaultLabel="Update assigned user"
				updatingLabel="Updating..."
				disabled={isPending || !hasChanges()}
			/>
		</div>
	);
};

export default PersonalizeArcade;
