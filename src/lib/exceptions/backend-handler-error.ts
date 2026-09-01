export const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const apiError = error as {
    message?: unknown;
    error?: {
      errors?: Array<{
        message?: unknown;
        field?: unknown;
      }>;
    };
  };

  const validationMessage = apiError.error?.errors?.[0]?.message;

  if (
    typeof validationMessage === "string" &&
    validationMessage.trim().length > 0
  ) {
    return validationMessage;
  }

  if (typeof apiError.message === "string") {
    return apiError.message;
  }

  return undefined;
};
