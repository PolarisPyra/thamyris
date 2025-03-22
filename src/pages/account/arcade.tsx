import React from "react";

import Header from "@/components/common/header";
import ArcadeConfiguration from "@/components/settings/common/arcade-configuration";

const Arcade = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Arcade Management"} />
			<div className="mx-auto max-w-2xl space-y-6">
				<ArcadeConfiguration />
			</div>
		</div>
	);
};

export default Arcade;
