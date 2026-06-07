"use server";

import { cookies } from "next/headers";
import { apiRoutes } from "../routes";
import { COOKIE_KEYS } from "../utils/cookies-types";
import { ApiResponse } from "./api-response";

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, finalOptions);

  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(apiRoutes.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Refresh token inválido");
      }

      const tokenData = await refreshResponse.json();
      const newAccessToken = tokenData.accessToken || tokenData.data?.accessToken;
      const newRefreshToken = tokenData.refreshToken || tokenData.data?.refreshToken || refreshToken;

      cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, finalOptions);

    } catch (error) {
      cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
      cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
      throw new Error("SESSION_EXPIRED");
    }
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición del servidor");
  }

  return data;
};