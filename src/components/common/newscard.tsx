import { motion } from "framer-motion";
import React from "react";

interface NewsCardProps {
	title: string;
	description: string;
	date: string;
	time: string;
	icon: React.ReactNode;
}

const NewsCard = ({ title, description, date, time, icon }: NewsCardProps) => {
	return (
		<motion.div
			className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0">{icon}</div>
				<div className="flex-1">
					<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					<p className="mt-2 text-gray-600">{description}</p>
					<div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
						<span>{date}</span>
						<span>•</span>
						<span>{time}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default NewsCard;
