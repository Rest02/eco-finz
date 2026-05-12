import React from "react";
import { cn } from "@/lib/utils";

interface FormattedValueProps {
  value: number;
  isPrivateMode?: boolean;
  className?: string;
}

export function FormattedValue({ value, isPrivateMode = false, className }: FormattedValueProps) {
  const formattedText = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <span
      className={cn(
        "transition-all duration-300 select-none inline-block",
        isPrivateMode && "blur-md saturate-0 opacity-50 pointer-events-none",
        className
      )}
    >
      {formattedText}
    </span>
  );
}
