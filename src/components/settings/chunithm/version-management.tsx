import React from "react";

import { toast } from "sonner";

import VersionManagement from "@/components/common/version-management";
import { useChunithmVersion, useChunithmVersions, useUpdateChunithmVersion } from "@/hooks/chunithm";
import { ChunithmVersions } from "@/types/enums";

const ChunithmVersionManager = () => {
	const version = useChunithmVersion();
	const { data: availableVersions } = useChunithmVersions();
	const { mutate: updateVersion, isPending } = useUpdateChunithmVersion();

	const handleUpdateVersion = (version: number) => {
		updateVersion(version, {
			onSuccess: () => toast.success("Chunithm version updated successfully!"),
			onError: () => toast.error("Failed to update Chunithm version"),
		});
	};

	return (
		<VersionManagement
			title="Set Chunithm version"
			currentVersion={version}
			availableVersions={availableVersions}
			isUpdating={isPending}
			onUpdateVersion={handleUpdateVersion}
			versions={ChunithmVersions}
			buttonLabel="Update Chunithm settings"
			updatingLabel="Updating..."
		/>
	);
};

export default ChunithmVersionManager;
