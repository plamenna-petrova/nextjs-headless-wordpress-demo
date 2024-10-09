import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import "./globals.css";
import { mergeClassNames } from "@/lib/utils";
import ThemeProvider from "@/components/theme/ThemeProvider";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

const fontSans: NextFontWithVariable = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

export const metadata: Metadata = {
    title: "WordPress As A Headless CMS Demo",
    description: "Using WordPress As A Headless CMS",
    metadataBase: new URL("http://localhost:3000/")
};

export const revalidate: number = 3600;

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head />
            <body
                className={mergeClassNames("min-h-screen font-sans antialiased", fontSans.variable)}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <div>{children}</div>
                    <Footer metadata={metadata} />
                </ThemeProvider>
            </body>
        </html>
    );
}

export default RootLayout;