import React from "react";

import Header from "@/components/common/header";
import CardManagement from "@/components/settings/ongeki/card-managment";
import ItemManagement from "@/components/settings/ongeki/item-management";
import JsonExport from "@/components/settings/ongeki/json-export";
import VersionManagement from "@/components/settings/ongeki/version-selection";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const OngekiSettingsPage: React.FC<GameSettingsProps> = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Ongeki Settings"} />
			<div className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15">
				<VersionManagement />
				<CardManagement />
				<ItemManagement />
				<JsonExport />
			</div>
		</div>
	);
};

export default OngekiSettingsPage;
