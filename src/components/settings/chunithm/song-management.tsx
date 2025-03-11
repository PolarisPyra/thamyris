import React from "react";

import { toast } from "sonner";

import { useLockSongs, useUnlockAllSongs } from "@/hooks/chunithm/use-unlocks";

import { SubmitButton } from "../../common/button";

const SongManagement = () => {
	const { mutate: unlockSongs, isPending: isUnlockingSongs } = useUnlockAllSongs();
	const { mutate: lockSongs, isPending: isLockingSongs } = useLockSongs();
	return (
		<div className="bg-opacity-50 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-md md:p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-100">Manage Songs</h2>
			<div className="flex gap-4">
				<SubmitButton
					onClick={() => {
						unlockSongs(undefined, {
							onSuccess: () => toast.success("Successfully unlocked all songs"),
							onError: () => toast.error("Failed to unlock songs"),
						});
					}}
					defaultLabel="Unlock All Songs"
					updatingLabel="Unlocking..."
					className="bg-green-600 hover:bg-green-700"
					disabled={isUnlockingSongs}
				/>
				<SubmitButton
					onClick={() => {
						lockSongs(undefined, {
							onSuccess: () => toast.success("Successfully locked songs"),
							onError: () => toast.error("Failed to lock songs"),
						});
					}}
					defaultLabel="Lock Songs"
					updatingLabel="Locking..."
					className="bg-red-600 hover:bg-red-700"
					disabled={isLockingSongs}
				/>
			</div>
		</div>
	);
};

export default SongManagement;
