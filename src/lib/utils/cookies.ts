"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS, UserAuthCredentialsInterface } from "./cookies-types";
import { FIFTEEN_DAYS_IN_SECONDS, ONE_DAY_IN_SECONDS } from "../constants";


export const setUserAuthCredentialsCookies = async (
  credentials: UserAuthCredentialsInterface
) => {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, credentials.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY_IN_SECONDS,
  });

  cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, credentials.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: FIFTEEN_DAYS_IN_SECONDS,
  });
};


export const getUserAuthCredentialsCookies = async (): Promise<UserAuthCredentialsInterface | null> => {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};


export const deleteUserAuthCredentialsCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
};