"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper({ metadata }: { metadata: any }) {
  const pathname = usePathname();
  const isDocumentationPage = pathname.startsWith("/documentation");

  return (
    <>
      {!isDocumentationPage && <Footer metadata={metadata} />}
    </>
  );
}
