import React from "react";

export default function Loader({
  size = "md",
  text = "Loading data...",
  fullHeight = false,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 ${
        fullHeight ? "min-h-[300px]" : ""
      } ${className}`.trim()}
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-primary border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-xs text-text-muted font-medium">{text}</p>}
    </div>
  );
}
