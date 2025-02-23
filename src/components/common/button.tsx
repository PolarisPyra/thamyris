import React from "react";

interface SubmitButtonProps {
    defaultLabel?: string;
    updatingLabel?: string;
    className?: string;
    textColor?: string;
    onClick: () => void;
}

export const SubmitButton = ({
  defaultLabel,
  className = "",
  textColor = "text-white",
  onClick,
}: SubmitButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full mt-4 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      <span className={textColor}>{defaultLabel}</span>
    </button>
  );
};