import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useTeams, useUpdateTeam } from "@/hooks/chunithm/use-teams";

import { SubmitButton } from "../../common/button";

const TeamManagement = () => {
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [selectedTeam, setSelectedTeam] = useState<string>("Select Team");
	const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

	const handleDropdownToggle = (section: number) => {
		setOpenDropdown(openDropdown === section ? null : section);
	};

	const { data: teams } = useTeams();
	const { mutate: updateTeamMutation, isPending: isUpdatingTeam } = useUpdateTeam();

	const handleTeamSelect = (teamId: number, teamName: string) => {
		setSelectedTeam(teamName);
		setSelectedTeamId(teamId);
		setOpenDropdown(null);
	};

	const getSelectedTeamLabel = () => {
		return selectedTeam;
	};

	const handleUpdateTeam = () => {
		if (selectedTeamId === null) {
			toast.error("Please select a team first");
			return;
		}

		updateTeamMutation(selectedTeamId, {
			onSuccess: () => toast.success("Successfully updated team"),
			onError: () => toast.error("Failed to update team"),
		});
	};

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Select Team</h2>

			<div className="mb-4">
				<button
					onClick={() => handleDropdownToggle(1)}
					className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
				>
					<span className="text-gray-200">{getSelectedTeamLabel()}</span>
					<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === 1 ? "rotate-180" : ""}`} />
				</button>

				<AnimatePresence>
					{openDropdown === 1 && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-2"
						>
							<div className="max-h-[285px] space-y-2 overflow-y-auto pr-2">
								{teams?.map((team) => (
									<div
										key={team.id}
										onClick={() => handleTeamSelect(team.id, team.teamName)}
										className="cursor-pointer rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600"
									>
										<span className="text-gray-200">{team.teamName}</span>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<SubmitButton
				onClick={handleUpdateTeam}
				defaultLabel="Update Team"
				updatingLabel="Updating..."
				className="bg-blue-600 hover:bg-blue-700"
				disabled={isUpdatingTeam || selectedTeamId === null}
			/>
		</div>
	);
};

export default TeamManagement;
