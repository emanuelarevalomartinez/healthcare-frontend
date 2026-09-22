export const REDIRECT_REASONS = {
  SESSION_EXPIRED: "session_expired",
} as const;

export const QUERY_PARAMS = {
  REASON: "reason",
} as const;

export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
export const FIFTEEN_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 15;

export const DEFAULT_SCHEDULE_VALUES = {
  startTime: "08:00",
  endTime: "17:00",
  available: true,
  note: "",
};
