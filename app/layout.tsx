import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextFont } from "next/dist/compiled/@next/font";
import "./globals.css";

const interFont: NextFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WordPress As A Headless CMS Demo",
    description: "Using WordPress As A Headless CMS",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en">
            <body className={interFont.className}>{children}</body>
        </html>
    );
}

export default RootLayout;