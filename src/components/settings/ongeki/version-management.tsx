import React from "react";

import { toast } from "sonner";

import VersionManagement from "@/components/common/version-management";
import { useOngekiVersion, useOngekiVersions, useUpdateOngekiVersion } from "@/hooks/ongeki/use-version";
import { OngekiVersions } from "@/types/games";

const OngekiVersionManager = () => {
	const { data: ongekiVersion } = useOngekiVersion();
	const { data: availableVersions } = useOngekiVersions();
	const { mutate: updateVersion, isPending } = useUpdateOngekiVersion();

	const handleUpdateVersion = (version: string) => {
		updateVersion(version, {
			onSuccess: (success) => toast.success(success.message),

			onError: (error) => toast.error(error.message),
		});
	};

	return (
		<VersionManagement
			title="Set Ongeki version"
			currentVersion={ongekiVersion}
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
