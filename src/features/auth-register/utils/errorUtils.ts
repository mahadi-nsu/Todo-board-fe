import type { IApiError, IRegisterError } from "../types";

export const parseRegisterError = (error: unknown): IRegisterError => {
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
      case 409:
        return {
          message: "An account with this email already exists.",
          code: "EMAIL_EXISTS",
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
    message: "Registration failed. Please try again.",
    code: "UNKNOWN_ERROR",
  };
};
