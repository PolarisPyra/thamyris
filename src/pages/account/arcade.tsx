import React from "react";

import Header from "@/components/common/header";
import ArcadeConfiguration from "@/components/settings/common/arcade-configuration";

const Arcade = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Arcade Management"} />
			<div className="mb-4 space-y-8 p-4 sm:px-6 sm:py-0">
				<ArcadeConfiguration />
			</div>
		</div>
	);
};

export default Arcade;
