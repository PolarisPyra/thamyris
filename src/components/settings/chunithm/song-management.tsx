import React from "react";

import { toast } from "sonner";

import { useLockSongs, useUnlockAllSongs } from "@/hooks/chunithm/use-unlocks";

import { SubmitButton } from "../../common/button";

const SongManagement = () => {
	const { mutate: unlockSongs, isPending: isUnlockingSongs } = useUnlockAllSongs();
	const { mutate: lockSongs, isPending: isLockingSongs } = useLockSongs();
	return (
		<div className="bg-card rounded-md p-4 md:p-6">
			<h2 className="text-primary mb-4 text-xl font-semibold">Manage Songs</h2>
			<div className="flex gap-4">
				<SubmitButton
					onClick={() => {
						unlockSongs(undefined, {
							onSuccess: (success) => toast.success(success.message),
							onError: (error) => toast.error(error.message),
						});
					}}
					defaultLabel="Unlock All Songs"
					updatingLabel="Unlocking..."
					disabled={isUnlockingSongs}
				/>
				<SubmitButton
					onClick={() => {
						lockSongs(undefined, {
							onSuccess: (success) => toast.success(success.message),
							onError: (error) => toast.error(error.message),
						});
					}}
					defaultLabel="Lock Songs"
					updatingLabel="Locking..."
					className="bg-buttonlockcontent hover:bg-buttonlockcontenthover"
					disabled={isLockingSongs}
				/>
			</div>
		</div>
	);
};

export default SongManagement;
