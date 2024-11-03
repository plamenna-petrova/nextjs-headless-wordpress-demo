import Section from "../section/section";
import Container from "../container/container";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/next.svg";
import { contentMenu, mainMenu } from "@/lib/constants";
import { Metadata } from "next";
import Balancer from "react-wrap-balancer";
import { ThemeToggle } from "../theme/theme-toggle";

type FooterProps = {
  metadata: Metadata;
}

const Footer = ({ metadata }: FooterProps) => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer>
      <Section>
        <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
          <div className="flex flex-col gap-6 not-prose">
            <Link href="/">
              <h3 className="sr-only">custom text</h3>
              <Image
                src={Logo}
                alt="Logo"
                className="hover:opacity-75 transition-all dark:invert"
                width={120}
                height={27.27}
              ></Image>
            </Link>
            <p>
              <Balancer>{metadata.description}</Balancer>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Website</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Blog</h5>
            {Object.entries(contentMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
        </Container>
        <Container className="border-t not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
          <ThemeToggle />
          <p className="text-muted-foreground">
            © <a href="https://github.com/plamenna-petrova?tab=repositories">Plamenna Petrova</a>. All rights reserved.
            {" "}{currentYear}-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;