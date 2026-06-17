import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  padding = "md",
}) => {
  // Only auto-remapping utilities here so the generic Card inherits every
  // vibe for free (bold flips bg-white dark + border-gray-200 neon via the
  // global theme layer; calm warms them). No `dark:` variants — the app
  // keys themes off html.vibe-*, not a `.dark` class, so they'd be dead code.
  const baseClasses = "bg-white rounded-2xl shadow-lg border border-gray-200";

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
    : "";

  const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;
