import type { IApiError, ILoginError } from "../types";

export const parseLoginError = (error: unknown): ILoginError => {
  const apiError = error as IApiError;

  // Handle field-specific errors
  if (apiError?.data?.errors && apiError.data.errors.length > 0) {
    const fieldError = apiError.data.errors[0];
    return {
      message: fieldError.message,
      field: fieldError.field,
    };
  }

  // Handle general API error message
  if (apiError?.data?.message) {
    return {
      message: apiError.data.message,
    };
  }

  // Handle HTTP status-based errors
  if (apiError?.status) {
    switch (apiError.status) {
      case 401:
        return {
          message: "Invalid email or password. Please check your credentials.",
          code: "INVALID_CREDENTIALS",
        };
      case 422:
        return {
          message: "Please check your input and try again.",
          code: "VALIDATION_ERROR",
        };
      case 500:
        return {
          message: "Server error. Please try again later.",
          code: "SERVER_ERROR",
        };
      default:
        return {
          message: "An unexpected error occurred. Please try again.",
          code: "UNKNOWN_ERROR",
        };
    }
  }

  // Handle network or other errors
  if (apiError?.message) {
    return {
      message: apiError.message,
    };
  }

  // Fallback error message
  return {
    message: "Login failed. Please try again.",
    code: "UNKNOWN_ERROR",
  };
};
