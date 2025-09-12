import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "floating";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left",
}) => {
  const baseClasses =
    "font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white focus:ring-pink-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline:
      "border-2 border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white focus:ring-pink-500 bg-transparent hover:shadow-lg transform hover:-translate-y-0.5",
    ghost:
      "text-pink-600 hover:bg-pink-50 focus:ring-pink-500 bg-transparent hover:shadow-md",
    floating:
      "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 focus:ring-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const renderContent = () => {
    if (!icon) return children;

    if (iconPosition === "left") {
      return (
        <>
          {icon}
          {children}
        </>
      );
    } else {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
