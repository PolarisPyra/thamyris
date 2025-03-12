import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useCreateTeam, useTeams, useUpdateTeam } from "@/hooks/chunithm/use-teams";

import { SubmitButton } from "../../common/button";

const TeamManagement = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<string>("Select Team");
	const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
	const [newTeamName, setNewTeamName] = useState("");

	const { data: teams } = useTeams();
	const { mutate: updateTeamMutation, isPending: isUpdatingTeam } = useUpdateTeam();
	const { mutate: createTeamMutation, isPending: isCreatingTeam } = useCreateTeam();

	const handleTeamSelect = (teamId: number, teamName: string) => {
		setSelectedTeam(teamName);
		setSelectedTeamId(teamId);
		setIsDropdownOpen(false);
	};

	const handleUpdateTeam = () => {
		if (selectedTeamId === null) {
			toast.error("Please select a team first");
			return;
		}

		updateTeamMutation(selectedTeamId, {
			onSuccess: (success) => toast.success(success.message),
			onError: (error) => toast.error(error.message),
		});
	};

	const handleCreateTeam = () => {
		if (!newTeamName.trim()) {
			toast.error("Please enter a team name");
			return;
		}

		createTeamMutation(newTeamName.trim(), {
			onSuccess: (success) => toast.success(success.message),
			onError: (error) => toast.error(error.message),
		});
	};

	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Select Team</h2>

			<div className="mb-4">
				<button
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					className="bg-dropdown hover:bg-dropdownhover flex w-full items-center justify-between rounded-md p-3 transition-colors"
				>
					<span className="text-primary">{selectedTeam}</span>
					<ChevronDown className={`text-primary h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
				</button>

				<AnimatePresence>
					{isDropdownOpen && (
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
										className="bg-dropdown hover:bg-dropdownhover cursor-pointer rounded-md p-2 transition-colors"
									>
										<span className="text-primary">{team.teamName}</span>
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
				className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover"
				disabled={isUpdatingTeam || selectedTeamId === null}
			/>

			<div className="mt-8">
				<h2 className="text-primary mb-4 text-xl font-semibold">Create New Team</h2>
				<div className="mb-4">
					<input
						type="text"
						value={newTeamName}
						onChange={(e) => setNewTeamName(e.target.value)}
						placeholder="Enter team name"
						className="bg-textbox text-primary placeholder:text-primary w-full rounded-md p-3"
					/>
				</div>
				<SubmitButton
					onClick={handleCreateTeam}
					defaultLabel="Create Team"
					updatingLabel="Creating..."
					className="bg-buttonunlockcontent hover:bg-buttonunlockcontenthover"
					disabled={isCreatingTeam || !newTeamName.trim()}
				/>
			</div>
		</div>
	);
};

export default TeamManagement;
