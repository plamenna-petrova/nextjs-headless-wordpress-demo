import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { mergeClassNames } from "@/lib/utils";
import ThemeProvider from "@/components/theme/theme-provider";
import NavbarWrapper from "@/components/navbar/navbar-wrapper";
import FooterWrapper from "@/components/footer/footer-wrapper";
import "./globals.css";
import AccessibilityMenuWidget from "@/components/accessiblity-menu-widget/AccessibilityMenuWidget";

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

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head/>
      <body className={mergeClassNames("min-h-screen font-sans antialiased", fontSans.variable)}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;