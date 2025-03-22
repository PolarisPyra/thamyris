import React from "react";

import Header from "@/components/common/header";
import ArcadeManagment from "@/components/settings/common/arcade-management";

const Arcade = () => {
	return (
		<div className="relative flex-1 overflow-auto">
			<Header title={"Arcade Management"} />
			<div className="mx-auto max-w-2xl space-y-6">
				<ArcadeManagment />
			</div>
		</div>
	);
};

export default Arcade;
