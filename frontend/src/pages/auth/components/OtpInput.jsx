import React, { useRef, useEffect } from "react";

export default function OtpInput({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}) {
  const inputRefs = useRef([]);

  // Split string into array
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    // Focus first empty input or first box on mount
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    if (inputRefs.current[targetIndex] && !disabled) {
      inputRefs.current[targetIndex].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1); // Only take last digit entered
    const newDigits = [...digits];
    newDigits[index] = char;

    const newValue = newDigits.join("");
    onChange(newValue);

    // Auto-advance to next box if digit entered
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move back and delete previous
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full overflow-hidden">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl bg-bg-card text-text-primary border transition-all outline-none select-all ${
            hasError
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
              : digits[idx]
              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
              : "border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          } ${disabled ? "bg-bg-hover opacity-60 cursor-not-allowed" : ""}`}
        />
      ))}
    </div>
  );
}
