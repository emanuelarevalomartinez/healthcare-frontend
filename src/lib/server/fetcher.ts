"use server";

import { cookies } from "next/headers";
import { apiRoutes, routes } from "../routes";
import { COOKIE_KEYS, UserAuthCredentialsInterface } from "../utils/cookies-types";
import { ApiResponse } from "./api-response";
import { redirect } from "next/navigation";
import { setUserAuthCredentialsCookies } from "../utils/cookies";

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

    let credentials: UserAuthCredentialsInterface;

    try {

      const refreshResponse = await fetch(apiRoutes.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
         console.log("error de refresh token");
        throw new Error("Invalid refresh token");

      }

      const tokenData = await refreshResponse.json();
      const newAccessToken = tokenData.accessToken;
      const newRefreshToken = tokenData.refreshToken;

     credentials = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }

      setUserAuthCredentialsCookies(credentials);

      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, finalOptions);
    } catch (error) {
      /* cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
      cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN); */

      credentials = {
        accessToken: "",
        refreshToken: ""
      }

   setUserAuthCredentialsCookies(credentials);

      console.log("sesion expirada");
redirect(`${routes.auth.login}?reason=session_expired`);
     // throw new Error("SESSION_EXPIRED");
    // throw new ServerSessionExpiredError();
    }
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {

    console.log( "response del error de fuera 2", response);

    throw new Error(data.message || "Server request error");
  }

  return data;
};
