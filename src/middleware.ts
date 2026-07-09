import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "@/lib/utils/cookies-types";
import { apiRoutes, FIFTEEN_DAYS_IN_SECONDS, ONE_DAY_IN_SECONDS, QUERY_PARAMS, REDIRECT_REASONS, routes } from "./lib";

const PUBLIC_ROUTES = [routes.auth.login, routes.auth.register];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

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
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  const accessTokenInvalid = !accessToken || isTokenExpired(accessToken);

  if (accessTokenInvalid && refreshToken) {
    try {
      const refreshResponse = await fetch(apiRoutes.auth.refresh, {
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
          maxAge: ONE_DAY_IN_SECONDS,
          path: "/",
        });
        response.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: FIFTEEN_DAYS_IN_SECONDS,
          path: "/",
        });

        return response;
      } else {
        const loginUrl = new URL(routes.auth.login, request.url);

        loginUrl.searchParams.set(
          QUERY_PARAMS.REASON,
          REDIRECT_REASONS.SESSION_EXPIRED
        );

        const response = NextResponse.redirect(loginUrl);

        response.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN);
        response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN);

        return response;
      }
    } catch (error) {
      const loginUrl = new URL(routes.auth.login, request.url);

      loginUrl.searchParams.set(
        QUERY_PARAMS.REASON,
        REDIRECT_REASONS.SESSION_EXPIRED
      );

      return NextResponse.redirect(loginUrl);
    }
  }
  if (accessTokenInvalid && !refreshToken) {
    const loginUrl = new URL(routes.auth.login, request.url);

    loginUrl.searchParams.set(
      QUERY_PARAMS.REASON,
      REDIRECT_REASONS.SESSION_EXPIRED
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|icons).*)"],
};
