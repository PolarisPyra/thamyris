import { motion } from "framer-motion";
import React from "react";

// ... existing imports ...

const QouteCard = ({
	name,
	icon: Icon,
	color,
	welcomeMessage,
}: {
	name: string;
	icon: React.ElementType;
	value?: string | number; // Make value optional since we'll use quotes list
	color: string;
	welcomeMessage?: string;
}) => {
	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 w-full"
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className="px-4 py-3 sm:px-6 sm:py-5">
				<div className="flex items-center">
					<Icon size={20} className="mr-1 sm:mr-2" style={{ color }} />
					{welcomeMessage && <span className="text-sm sm:text-base">{welcomeMessage}</span>}
				</div>
				<span className="font-bold text-sm sm:text-base break-words block mt-1">{name}</span>
			</div>
		</motion.div>
	);
};
export default QouteCard;
