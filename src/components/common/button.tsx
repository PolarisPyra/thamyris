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
      className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-bold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <span className={textColor}>{defaultLabel}</span>
    </button>
  );
};
