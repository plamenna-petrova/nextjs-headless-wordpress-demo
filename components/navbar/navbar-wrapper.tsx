"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const locale = useLocale();
  const pathname: string = usePathname();
  const isDocumentationPage: boolean = pathname.startsWith(`/${locale}/documentation`);

  return (
    <>
      {!isDocumentationPage && <Navbar />}
    </>
  );
}
