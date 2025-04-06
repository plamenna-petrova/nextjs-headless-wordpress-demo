"use client";

import { useState } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ArrowRightSquare } from "lucide-react";
import { mergeClassNames } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { mainMenu, contentMenu } from "@/lib/constants";

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const MobileLink = ({ href, onOpenChange, className, children, ...props }: MobileLinkProps) => {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={mergeClassNames("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

const MobileNavigation = () => {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState<boolean>(false);

  return (
    <Sheet open={isMobileNavigationOpen} onOpenChange={setIsMobileNavigationOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setIsMobileNavigationOpen}
        >
          <ArrowRightSquare className="mr-2 h-4 w-4" />
          <span className="text-muted-foreground">Демонстративно приложение</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-small mt-6">Основно Меню</h3>
            <Separator />
            {Object.entries(mainMenu).map(([key, href]) => (
              <MobileLink key={key} href={href} onOpenChange={setIsMobileNavigationOpen}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </MobileLink>
            ))}
            <h3 className="text-small pt-6">Блог</h3>
            <Separator />
            {Object.entries(contentMenu).map(([key, href]) => (
              <MobileLink key={key} href={href} onOpenChange={setIsMobileNavigationOpen}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;