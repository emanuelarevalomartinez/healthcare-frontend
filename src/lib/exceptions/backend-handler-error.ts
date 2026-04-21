export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return "Error desconocido";
};
