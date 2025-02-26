import React from "react";

const QouteCard = ({
	tagline,
	value,
	icon: Icon,
	color,
	welcomeMessage,
}: {
	tagline: string;
	icon: React.ElementType;
	value?: string | number; // Make value optional since we'll use quotes list
	color: string;
	welcomeMessage?: string;
}) => {
	return (
		<div className="bg-opacity-50 w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-lg backdrop-blur-md">
			<div className="px-4 py-3 sm:px-6 sm:py-5">
				<div className="flex items-center">
					<Icon size={20} className="mr-1 sm:mr-2" style={{ color }} />
					{welcomeMessage && <span className="text-sm sm:text-base">{welcomeMessage}</span>}
				</div>
				<span className="mt-1 block text-sm font-bold break-words sm:text-base">{tagline}</span>
				<span className="mt-1 block text-sm font-bold break-words sm:text-base">{value}</span>
			</div>
		</div>
	);
};
export default QouteCard;
