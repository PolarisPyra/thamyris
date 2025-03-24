import React from "react";

import Header from "@/components/common/header";
import CardManagement from "@/components/settings/ongeki/card-managment";
import ItemManagement from "@/components/settings/ongeki/item-management";
import JsonExport from "@/components/settings/ongeki/json-export";
import VersionManagement from "@/components/settings/ongeki/version-management";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const OngekiSettingsPage: React.FC<GameSettingsProps> = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Ongeki Settings"} />
			<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
				<VersionManagement />
				<CardManagement />
				<ItemManagement />
				<JsonExport />
			</div>
		</div>
	);
};

export default OngekiSettingsPage;
