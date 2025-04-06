"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname: string = usePathname();
  const isDocumentationPage: boolean = pathname.startsWith("/documentation");

  return (
    <>
      {!isDocumentationPage && <Footer />}
    </>
  );
}
