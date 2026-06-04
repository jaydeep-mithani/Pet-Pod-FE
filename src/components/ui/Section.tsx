import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "gray" | "blue" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  background = "white",
  padding = "lg",
}) => {
  const backgroundClasses = {
    white: "bg-white dark:bg-gray-900",
    gray: "bg-gray-50 dark:bg-gray-800",
    blue: "bg-blue-50 dark:bg-blue-900/20",
    gradient:
      "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900",
  };

  const paddingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  };

  const classes = `${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`;

  return (
    <section className={classes}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};

export default Section;
