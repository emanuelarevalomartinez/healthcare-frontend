// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "@/lib/utils/cookies-types";
import { API_URL } from "@/lib/config/config";

function isTokenExpired(token: string, bufferSeconds = 5): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now + bufferSeconds;
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  const accessTokenInvalid = !accessToken || isTokenExpired(accessToken);

  if (accessTokenInvalid && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          data.data;

        const response = NextResponse.next();

        response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        response.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return response;
      } else {
        const response = NextResponse.redirect(
          new URL("/auth/login?reason=session_expired", request.url)
        );
        response.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN);
        response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN);
        return response;
      }
    } catch (error) {
      return NextResponse.redirect(
        new URL("/auth/login?reason=session_expired", request.url)
      );
    }
  }
  if (accessTokenInvalid && !refreshToken) {
    return NextResponse.redirect(
      new URL("/auth/login?reason=session_expired", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/dashboard/:path*"],
};
