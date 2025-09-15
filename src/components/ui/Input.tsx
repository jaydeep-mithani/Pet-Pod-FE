"use client";

import { Calendar, LucideIcon } from "lucide-react";
import React, { useRef } from "react";

interface InputProps {
  label?: string;
  type?: "text" | "email" | "password" | "tel" | "date";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  name,
  id,
  icon: Icon,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
      )}
      <div
        className="flex items-center px-3 gap-3 rounded-xl border-2 transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
          dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {type === "date" ? (
          <button
            type="button"
            onClick={() => inputRef.current?.showPicker?.()}
            className="rounded-full text-gray-400 hover:text-gray-200"
          >
            <Calendar className="w-4 h-4" />
          </button>
        ) : (
          Icon && <Icon className="text-white/40 w-4 h-4" />
        )}
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full py-3 outline-0
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 hover:border-pink-300 focus:border-pink-500"
          }
        `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
