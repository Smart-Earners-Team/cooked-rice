import React from "react";
import type { ButtonProps } from "../../types";
import cls from "classnames";

export default function Button({
  className,
  label,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cls(
        "rounded-md px-4 py-2 ring-1 bg-gray-300 text-gray-800 hover:bg-gray-400 ring-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-80",
        className
      )}
      {...props}
      title={label}
    >
      {children || label}
    </button>
  );
}
