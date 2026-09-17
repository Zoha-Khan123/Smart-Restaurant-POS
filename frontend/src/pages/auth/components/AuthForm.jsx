import React from "react";

export default function AuthForm({ onSubmit, children, className = "" }) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`space-y-4 sm:space-y-5 ${className}`}
    >
      {children}
    </form>
  );
}
