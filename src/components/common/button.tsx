import React from "react";

interface SubmitButtonProps {
	defaultLabel?: string;
	updatingLabel?: string;
	className?: string;
	textColor?: string;
	onClick: () => void;
	disabled?: boolean;
}

export const SubmitButton = ({
	defaultLabel,
	className = "",
	textColor = "text-white",
	onClick,
	disabled = false,
}: SubmitButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`w-full mt-4 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
		>
			<span className={textColor}>{defaultLabel}</span>
		</button>
	);
};
