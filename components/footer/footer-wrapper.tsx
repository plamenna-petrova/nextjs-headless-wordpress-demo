"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Footer from "./footer";

export default function FooterWrapper() {
  const locale = useLocale();
  const pathname: string = usePathname();
  const isDocumentationPage: boolean = pathname.startsWith(`/${locale}/documentation`);

  return (
    <>
      {!isDocumentationPage && <Footer />}
    </>
  );
}
