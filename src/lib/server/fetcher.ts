"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "../utils/cookies-types";
import { ApiResponse } from "./api-response";

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(url, { ...options, headers });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Server request error");
  }

  return data;
};
