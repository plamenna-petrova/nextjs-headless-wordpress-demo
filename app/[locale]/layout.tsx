import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { mergeClassNames } from "@/lib/utils";
import { LanguageProvider } from "@/context/LanguageContext";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ThemeProvider from "@/components/theme/theme-provider";
import NavbarWrapper from "@/components/navbar/navbar-wrapper";
import FooterWrapper from "@/components/footer/footer-wrapper";
import AccessibilityMenuWidget from "@/components/accessiblity-menu-widget/AccessibilityMenuWidget";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Демонстративно приложение на WordPress като система за управление на съдържанието, базирана на ,,Headless’’ архитектурата",
  description: "Как WordPress може да функционира като система за управление на съдържанието, базирана на ,,Headless’’ архитектурата",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  authors: [
    {
      name: "plamenna-petrova",
      url: "https://github.com/plamenna-petrova?tab=repositories",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head />
      <body className={mergeClassNames("min-h-screen font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <NavbarWrapper />
              {children}
              <AccessibilityMenuWidget />
              <FooterWrapper />
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}