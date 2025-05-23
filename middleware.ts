import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, Locale } from "@/lib/i18n";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    const locale = request.cookies.get("NEXT_LOCALE")?.value;

    if (locale && locales.includes(locale as Locale)) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/(bg|en|es|fr|de|jp)/:path*"],
};