import React from "react";

interface ErrorMessageProps {
  error: string | null;
  className?: string;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className = "",
  showIcon = true,
}) => {
  if (!error) return null;

  return (
    <div
      className={`error-message ${className}`}
      style={{
        color: "#dc2626",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        margin: "0.5rem 0",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {showIcon && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )}
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
