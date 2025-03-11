import React from "react";

import { toast } from "sonner";

import VersionManagement from "@/components/common/version-management";
import { useChunithmVersion, useChunithmVersions, useUpdateChunithmVersion } from "@/hooks/chunithm/use-version";

const ChunithmVersionManager = () => {
	const { data: chunithmVersion } = useChunithmVersion();
	const { data: versions } = useChunithmVersions();
	const { mutate: updateVersion, isPending } = useUpdateChunithmVersion();

	const chunithmVersions: Record<number, string> = {
		11: "Chunithm New",
		12: "Chunithm New Plus",
		13: "Chunithm Sun",
		14: "Chunithm Sun Plus",
		15: "Chunithm Luminous",
		16: "Chunithm Luminous Plus",
		17: "Chunithm Verse",
	};

	const handleUpdateVersion = (version: string) => {
		updateVersion(version, {
			onSuccess: () => {
				toast.success("Successfully updated game version");
			},
			onError: () => {
				toast.error("Failed to update game version");
			},
		});
	};

	return (
		<VersionManagement
			title="Set Chunithm version"
			currentVersion={chunithmVersion}
			availableVersions={versions}
			isUpdating={isPending}
			onUpdateVersion={handleUpdateVersion}
			versions={chunithmVersions}
			buttonLabel="Update Chunithm settings"
			updatingLabel="Updating..."
		/>
	);
};

export default ChunithmVersionManager;
