/* "use server";

import { cookies } from "next/headers";
import { apiRoutes } from "../routes";
import { COOKIE_KEYS } from "../utils/cookies-types";

export const fetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const cookieStore = await cookies();
  
  // 1. Obtener los tokens desde las Cookies del Servidor
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  // 2. Configurar los Headers de la petición
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Inyectar automáticamente el token de acceso si existe
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  // 4. Primera petición a la API de Spring Boot
  let response = await fetch(url, finalOptions);

  // 5. Si el token expiró (401), intentamos renovarlo con el Refresh Token
  if (response.status === 401 && refreshToken) {
    try {
      // Petición al endpoint de refresh en tu Spring Boot
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

      // 6. Actualizar las Cookies en el Servidor de forma inmediata
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true, // Seguridad contra ataques XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      // 7. Re-intentar la petición original con el nuevo token generado
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, finalOptions);

    } catch (error) {
      // 🚨 Si el refresh token también falló, borramos las cookies para desloguear
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      throw new Error("SESSION_EXPIRED");
    }
  }

  // 8. Procesar la respuesta final
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición del servidor");
  }

  return data;
}; */

"use server";

import { cookies } from "next/headers";
import { apiRoutes } from "../routes";
import { COOKIE_KEYS } from "../utils/cookies-types";
import { ApiResponse } from "./api-response";

// Añadimos <T = any> y devolvemos Promise<ApiResponse<T>>
export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const cookieStore = await cookies();
  
  // 1. Obtener los tokens desde las Cookies del Servidor
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  // 2. Configurar los Headers de la petición
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Inyectar automáticamente el token de acceso si existe
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  // 4. Primera petición a la API de Spring Boot
  let response = await fetch(url, finalOptions);

  // 5. Si el token expiró (401), intentamos renovarlo con el Refresh Token
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
      // Asumimos que la respuesta del refresh también viene envuelta en tu estructura estándar (.data)
      const newAccessToken = tokenData.accessToken || tokenData.data?.accessToken;
      const newRefreshToken = tokenData.refreshToken || tokenData.data?.refreshToken || refreshToken;

      // 6. Actualizar las Cookies en el Servidor de forma inmediata
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

      // 7. Re-intentar la petición original con el nuevo token generado
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, finalOptions);

    } catch (error) {
      cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
      cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
      throw new Error("SESSION_EXPIRED");
    }
  }

  // 8. Procesar la respuesta final (Tipada estrictamente como ApiResponse<T>)
  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición del servidor");
  }

  return data;
};