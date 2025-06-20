import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { mergeClassNames } from "@/lib/utils";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { TextToSpeechConversionOnHover } from "@/components/accessiblity-menu-widget/TextToSpeechConversionOnHover";
import Script from "next/script";
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
  title: "Demo Application of WordPress as a Content Management System Based on a Headless Architecture",
  description: "How WordPress can function as a Content Management System based on a Headless Architecture",
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
    { rel: "apple-touch-icon", url: "/icons/icon-128x128.png" },
    { rel: "icon", url: "/icons/icon-128x128.png" },
  ],
};

export default async function LocaleBasedLayout({
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
      <head>
        {process.env.NODE_ENV === "production" && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ruf2fswf6t");
            `,
            }}
          />
        )}
      </head>
      <body className={mergeClassNames("min-h-screen font-sans antialiased", fontSans.variable)}>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarWrapper />
            {children}
            <AccessibilityMenuWidget />
            <FooterWrapper />
            <TextToSpeechConversionOnHover />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}