import React from "react";

const StatCard = ({
	name,
	icon: Icon,
	value,
	color,
}: {
	name: string;
	icon: React.ElementType;
	value: string | number;
	color: string;
}) => {
	return (
		<div className="border-border bg-card overflow-hidden rounded-xl border">
			<div className="px-4 py-5 sm:p-6">
				<span className="flex items-center text-sm font-medium text-gray-400">
					<Icon size={20} className="mr-2" style={{ color }} />
					{name}
				</span>
				<p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
			</div>
		</div>
	);
};
export default StatCard;
