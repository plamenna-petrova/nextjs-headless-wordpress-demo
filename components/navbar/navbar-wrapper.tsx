"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isDocumentationPage = pathname.startsWith("/documentation");

  return (
    <>
      {!isDocumentationPage && <Navbar />}
    </>
  );
}
