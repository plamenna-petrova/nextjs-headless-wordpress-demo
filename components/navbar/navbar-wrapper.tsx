"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname: string = usePathname();
  const isDocumentationPage: boolean = pathname.startsWith("/documentation");

  return (
    <>
      {!isDocumentationPage && <Navbar />}
    </>
  );
}
