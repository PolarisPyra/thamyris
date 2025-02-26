import React from "react";

import { motion } from "framer-motion";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner = ({ size = 20, color = "#ffffff", className = "" }: SpinnerProps) => {
  return (
    <motion.div
      className={`rounded-full border-2 border-t-transparent ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default Spinner;
