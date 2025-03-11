import React from "react";

import { toast } from "sonner";

import VersionManagement from "@/components/common/version-management";
import { useOngekiVersion, useOngekiVersions, useUpdateOngekiVersion } from "@/hooks/ongeki/use-version";

const OngekiVersionManager = () => {
	const { data: ongekiVersion } = useOngekiVersion();
	const { data: availableVersions } = useOngekiVersions();
	const { mutate: updateVersion, isPending } = useUpdateOngekiVersion();

	const ongekiVersions: Record<number, string> = {
		6: "Ongeki Bright",
		7: "Ongeki Bright Memory",
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
			title="Set Ongeki version"
			currentVersion={ongekiVersion}
			availableVersions={availableVersions}
			isUpdating={isPending}
			onUpdateVersion={handleUpdateVersion}
			versions={ongekiVersions}
			buttonLabel="Update Ongeki settings"
			updatingLabel="Updating..."
		/>
	);
};

export default OngekiVersionManager;
