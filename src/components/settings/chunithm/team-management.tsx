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
			onSuccess: () => toast.success("Successfully updated team"),
			onError: () => toast.error("Failed to update team"),
		});
	};

	const handleCreateTeam = () => {
		if (!newTeamName.trim()) {
			toast.error("Please enter a team name");
			return;
		}

		createTeamMutation(newTeamName.trim(), {
			onSuccess: () => {
				toast.success("Successfully created team");
				setNewTeamName("");
			},
			onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create team"),
		});
	};

	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Select Team</h2>

			<div className="mb-4">
				<button
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
				>
					<span className="text-gray-200">{selectedTeam}</span>
					<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
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

			<div className="mt-8">
				<h2 className="mb-4 text-xl font-semibold text-gray-100">Create New Team</h2>
				<div className="mb-4">
					<input
						type="text"
						value={newTeamName}
						onChange={(e) => setNewTeamName(e.target.value)}
						placeholder="Enter team name"
						className="w-full rounded-lg bg-gray-700 p-3 text-gray-200 placeholder:text-gray-400"
					/>
				</div>
				<SubmitButton
					onClick={handleCreateTeam}
					defaultLabel="Create Team"
					updatingLabel="Creating..."
					className="bg-green-600 hover:bg-green-700"
					disabled={isCreatingTeam || !newTeamName.trim()}
				/>
			</div>
		</div>
	);
};

export default TeamManagement;
