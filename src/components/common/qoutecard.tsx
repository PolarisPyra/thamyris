import React from "react";

const QouteCard = ({
	header,
	value,
	icon: Icon,
	color,
	welcomeMessage,
}: {
	header: React.ReactNode;
	icon?: React.ElementType;
	value?: string | number; // Make value optional since we'll use quotes list
	color: string;
	welcomeMessage?: React.ReactNode;
}) => {
	return (
		<div className="0 bg-card w-full overflow-hidden rounded-md">
			<div className="px-4 py-3 sm:px-6 sm:py-5">
				<span className="text-primary mt-1 block text-sm font-bold break-words sm:text-base">{header}</span>

				<div className="flex items-center">
					{Icon && <Icon size={20} className="mr-1 sm:mr-2" style={{ color }} />}
					{welcomeMessage && <span className="text-primary text-sm sm:text-base">{welcomeMessage}</span>}
				</div>
				<span className="text-primary mt-1 block text-sm font-bold break-words sm:text-base">{value}</span>
			</div>
		</div>
	);
};
export default QouteCard;
