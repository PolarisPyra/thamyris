import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useEffect } from "react";

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
				className="fixed bottom-4 right-4 z-50"
			>
				<div
					className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg ${
						type === "success"
							? "bg-green-600/90 backdrop-blur-sm border border-green-500"
							: "bg-red-600/90 backdrop-blur-sm border border-red-500"
					}`}
				>
					{type === "success" ? (
						<CheckCircle className="w-6 h-6 text-green-100" />
					) : (
						<XCircle className="w-6 h-6 text-red-100" />
					)}
					<span className="text-gray-100 text-sm font-medium">{message}</span>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
