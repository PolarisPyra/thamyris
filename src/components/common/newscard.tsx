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
		<div className="bg-card rounded-md p-6">
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0">{icon}</div>
				<div className="flex-1">
					<h2 className="text-primary text-xl font-semibold">{title}</h2>
					<p className="text-primary mt-2">{description}</p>
					<div className="text-primary mt-4 flex items-center space-x-4 text-sm">
						<span>{date}</span>
						<span>•</span>
						<span>{time}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewsCard;
