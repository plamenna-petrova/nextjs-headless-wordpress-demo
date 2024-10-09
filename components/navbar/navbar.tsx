import { mergeClassNames } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/next.svg";
import { mainMenu } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type NavbarProps = {
    id?: string;
    className?: string;
    children?: React.ReactNode;
}

const Navbar = ({ id, className, children }: NavbarProps) => {
    return (
        <nav
            className={mergeClassNames(
                "sticky z-50 top-0 bg-background",
                "border-b",
                "fade-in",
                className,
            )}
            id={id}
        >
            <div
                id="nav-container"
                className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
            >
                <Link
                    className="hover:opacity-75 transition-all flex gap-2 items-center"
                    href="/"
                >
                    <h2 className="sr-only">WordPress As A Headless CMS</h2>
                    <Image
                        src={Logo}
                        alt="Logo"
                        className="dark:invert"
                        width={84}
                        height={50.54}
                    ></Image>
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
                    <Button asChild className="hidden sm:flex">
                        <Link href="/">Get Started</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;