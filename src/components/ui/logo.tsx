import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  imgClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "",
  className,
  imgClassName,
}) => {
  const sizeClasses = {
    sm: "w-[3rem]",
    md: "w-[5rem]",
    lg: "w-[6rem]",
    xl: "w-[7rem]",
    "2xl": "w-[9rem]",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="logo.png"
        alt="Convelix Logo"
        className={cn(sizeClasses[size], imgClassName)}
      />
    </div>
  );
};
