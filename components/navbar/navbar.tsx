import { Button } from "@/components/ui/button";
import { mergeClassNames } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { buildMainMenu } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/NextJS-Headless-WordPress-Demo-Logo.jpg";
import MobileNavigation from "../mobile-navigation/MobileNavigation";

type NavbarProps = {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const Navbar = ({ id, className, children }: NavbarProps) => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  
  const mainMenu = buildMainMenu(t, locale);

  return (
    <nav id={id} className={mergeClassNames("sticky z-50 top-0 bg-background", "border-b", "fade-in", className)}>
      <div id="nav-container" className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center">
        <Link href="/" className="hover:opacity-75 transition-all flex gap-2 items-center">
          <h2 className="sr-only">WordPress As A Headless CMS</h2>
          <Image src={Logo} alt="Logo" width={65} height={35.54}></Image>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild className="hidden sm:flex bg-blue-500 hover:bg-blue-500 text-white">
            <Link href={`/${locale}/documentation/about-the-application`}>{t('aboutTheApplication')}</Link>
          </Button>
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;