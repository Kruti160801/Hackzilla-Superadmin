// Error handling utility functions

export interface ErrorInfo {
  message: string;
  code?: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, any>;
}

export const logError = (error: any, context?: Record<string, any>) => {
  const errorInfo: ErrorInfo = {
    message: error.message || "Unknown error",
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  };

  // Log to console with detailed information
  console.error("Application Error:", errorInfo);

  // In production, you could send this to an error tracking service
  // like Sentry, LogRocket, or your own error logging endpoint
  if (process.env.NODE_ENV === "production") {
    // Example: sendErrorToService(errorInfo);
  }

  return errorInfo;
};

export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error.code;

  switch (errorCode) {
    // Authentication errors
    case "auth/user-not-found":
      return "User not found. Please check your email or sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/email-already-in-use":
      return "Email already registered. Please login instead.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    // Firestore errors
    case "permission-denied":
      return "You don't have permission to perform this action.";
    case "unavailable":
      return "Service temporarily unavailable. Please try again.";
    case "unauthenticated":
      return "Please log in to continue.";

    // Default
    default:
      return error.message || "An unexpected error occurred.";
  }
};

export const handleAsyncError = async <T>(
  asyncFunction: () => Promise<T>,
  context?: Record<string, any>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const data = await asyncFunction();
    return { data, error: null };
  } catch (error: any) {
    const errorInfo = logError(error, context);
    const userMessage = getFirebaseErrorMessage(error);
    return { data: null, error: userMessage };
  }
};
