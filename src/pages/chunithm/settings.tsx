import React from "react";

import Header from "@/components/common/header";
import JsonExport from "@/components/settings/chunithm/json-export";
import SongManagement from "@/components/settings/chunithm/song-management";
import TeamManagement from "@/components/settings/chunithm/team-management";
import TicketManagement from "@/components/settings/chunithm/ticket-management";
import VersionManagement from "@/components/settings/chunithm/version-management";

interface GameSettingsProps {
	onUpdate?: () => void;
}

const ChunithmSettingsPage: React.FC<GameSettingsProps> = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Chunithm Settings"} />
			<div className="flex w-full flex-col gap-4 px-4 pt-4 md:gap-8 md:pt-15">
				<VersionManagement />
				<TeamManagement />
				<SongManagement />
				<TicketManagement />
				<JsonExport />
			</div>
		</div>
	);
};

export default ChunithmSettingsPage;
