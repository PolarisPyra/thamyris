import React from "react";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";

import Header from "@/components/common/header";
import StatCard from "@/components/common/statcard";

const OverviewPage = () => {
	return (
		<div className="relative z-10 flex-1 overflow-auto">
			<Header title="Overview" />
			<main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
				<motion.div
					className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name={"Allnet"} icon={Circle} value={"GOOD"} color={"#59ba22"} />{" "}
					<StatCard name={"Billing"} icon={Circle} value={"GOOD"} color={"#59ba22"} />
				</motion.div>
			</main>
		</div>
	);
};

export default React.memo(OverviewPage);
