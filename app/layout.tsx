import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { mergeClassNames } from "@/lib/utils";
import ThemeProvider from "@/components/theme/theme-provider";
import NavbarWrapper from "@/components/navbar/navbar-wrapper";
import FooterWrapper from "@/components/footer/footer-wrapper";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "WordPress As A Headless CMS Demo",
  description: "Using WordPress As A Headless CMS",
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
          <FooterWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;