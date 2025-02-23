import React from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import NewsCard from "@/components/common/newscard";
import Header from "@/components/common/header";

const newsBulletin = [
	{
		id: 1,
		title: "New Frontend launched",
		description: "Welcome to Thamyris",
		date: "2025-23-02",
		time: "12:00 AM UTC",
		icon: <Calendar className="w-6 h-6 text-blue-500" />,
	},
];

const ServerNews = () => {
	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title={"Server Updates"} />

			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{newsBulletin.map((item) => (
						<NewsCard
							key={item.id}
							title={item.title}
							description={item.description}
							date={item.date}
							time={item.time}
							icon={item.icon}
						/>
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default ServerNews;
