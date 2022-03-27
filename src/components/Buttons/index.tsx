import React from "react";
import type { ButtonProps } from "../../types";
import cls from "classnames";
import { RiLoaderLine } from "react-icons/ri";

export default function Button({
  className,
  label,
  children,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cls(
        "rounded-md px-4 py-2 ring-1 bg-gray-300 text-gray-800 hover:bg-gray-400 ring-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-60 text-center",
        className
      )}
      {...props}
      title={label}
    >
      {children}
      {loading && <RiLoaderLine className="animate-spin inline-block h-5 w-5 ml-1" />}
    </button>
  );
}
