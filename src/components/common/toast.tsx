import React, { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface ToastProps {
	message: string;
	type: "success" | "error";
	onClose: () => void;
	duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);
		return () => clearTimeout(timer);
	}, [onClose, duration]);

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.3 }}
				className="fixed right-4 bottom-4 z-50"
			>
				<div
					className={`flex items-center space-x-3 rounded-lg p-4 shadow-lg ${
						type === "success"
							? "border border-green-500 bg-green-600/90 backdrop-blur-sm"
							: "border border-red-500 bg-red-600/90 backdrop-blur-sm"
					}`}
				>
					{type === "success" ? (
						<CheckCircle className="h-6 w-6 text-green-100" />
					) : (
						<XCircle className="h-6 w-6 text-red-100" />
					)}
					<span className="text-sm font-medium text-gray-100">{message}</span>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
