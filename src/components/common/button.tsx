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
	textColor = "text-buttontext",
	onClick,
	disabled = false,
}: SubmitButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`bg-button hover:bg-buttonhover text-buttontext mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
		>
			<span className={textColor}>{defaultLabel}</span>
		</button>
	);
};
