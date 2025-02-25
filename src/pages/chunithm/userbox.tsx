import React from "react";

import MapiconSelector from "@/components/chunithm/mapicon-customization";
import NameplateSelector from "@/components/chunithm/nameplate-customization";
import PenguinDressup from "@/components/chunithm/penguin-dressup";
import SystemvoiceSelector from "@/components/chunithm/systemvoice-customization";
import Header from "@/components/common/header";

const ChunithmUserbox = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Userbox"} />
			<div className="flex flex-col items-center">
				<PenguinDressup />
				<NameplateSelector />
				<SystemvoiceSelector />
				<MapiconSelector />
			</div>
		</div>
	);
};

export default ChunithmUserbox;
