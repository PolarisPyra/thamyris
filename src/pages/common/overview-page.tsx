import React from "react";

// import { Circle } from "lucide-react";

import Header from "@/components/common/header";

// import StatCard from "@/components/common/statcard";

const OverviewPage = () => {
	return (
		<div className="relative z-10 flex-1 overflow-auto">
			<Header title="Overview" />
			<span className="text-primary">WIP</span>

			{/* <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
				<div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
					<StatCard name={"Allnet"} icon={Circle} value={"GOOD"} color={"#59ba22"} />{" "}
					<StatCard name={"Billing"} icon={Circle} value={"GOOD"} color={"#59ba22"} />
				</div>
			</main> */}
		</div>
	);
};

export default React.memo(OverviewPage);
