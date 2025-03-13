import React from "react";

import { Hammer } from "lucide-react";

import Header from "@/components/common/header";
import NewsCard from "@/components/common/newscard";

const newsBulletin = [
	{
		id: 1,
		title: "Build Version",
		date: `${env.BUILD_DATE_YEAR_MONTH_DAY}`,
		time: `${env.BUILD_TIME_12_HOUR} UTC`,
		icon: <Hammer className="h-6 w-6 text-blue-500" />,
	},
];

const ServerNews = () => {
	return (
		<div className="relative z-10 flex-1 overflow-auto">
			<Header title={"Server Updates"} />

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{newsBulletin.map((item) => (
						<NewsCard key={item.id} title={item.title} date={item.date} time={item.time} icon={item.icon} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ServerNews;
