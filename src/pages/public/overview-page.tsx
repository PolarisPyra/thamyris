import Header from "@/components/common/header";
import React from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/common/statcard";
import { Circle } from "lucide-react";
const OverviewPage = () => {
	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Overview" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
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

export default OverviewPage;
