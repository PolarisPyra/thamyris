import React from "react";

import { toast } from "sonner";

import VersionManagement from "@/components/common/version-management";
import { useOngekiVersion, useOngekiVersions, useUpdateOngekiVersion } from "@/hooks/ongeki";
import { OngekiVersions } from "@/types/enums";

const OngekiVersionManager = () => {
	const version = useOngekiVersion();

	const { data: availableVersions } = useOngekiVersions();
	const { mutate: updateVersion, isPending } = useUpdateOngekiVersion();

	const handleUpdateVersion = (version: number) => {
		updateVersion(version, {
			onSuccess: () => {
				toast.success("Ongeki version updated successfully!");
			},
			onError: () => {
				toast.error("Failed to update Ongeki version");
			},
		});
	};

	return (
		<VersionManagement
			title="Set Ongeki version"
			currentVersion={version}
			availableVersions={availableVersions}
			isUpdating={isPending}
			onUpdateVersion={handleUpdateVersion}
			versions={OngekiVersions}
			buttonLabel="Update Ongeki settings"
			updatingLabel="Updating..."
		/>
	);
};

export default OngekiVersionManager;
