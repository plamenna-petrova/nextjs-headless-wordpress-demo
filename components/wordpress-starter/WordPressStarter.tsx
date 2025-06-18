"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, MotionValue } from "framer-motion";
import { Pen, File, User, Tag, Boxes, Folder, LucideIcon } from "lucide-react";
import { FeatureIcon, FeaturePattern } from "@/components/documentation/Features";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

type LinkPattern = {
  y: number;
  squares: [number, number][];
};

type LinkItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  pattern: LinkPattern;
};

const baseLinks: (Omit<LinkItem, "href" | "name" | "description"> & {
  baseHref: string,
  nameKey: string,
  descriptionKey: string
})[] = [
  {
    nameKey: "posts.title",
    descriptionKey: "posts.description",
    icon: Pen,
    baseHref: "/posts?page=1",
    pattern: { y: 16, squares: [[0, 1], [1, 3]] },
  },
  {
    nameKey: "pages.title",
    descriptionKey: "pages.description",
    icon: File,
    baseHref: "/pages",
    pattern: { y: -6, squares: [[-1, 2], [1, 3]] },
  },
  {
    nameKey: "authors.title",
    descriptionKey: "authors.description",
    icon: User,
    baseHref: "/posts/authors",
    pattern: { y: 32, squares: [[0, 2], [1, 4]] },
  },
  {
    nameKey: "tags.title",
    descriptionKey: "tags.description",
    icon: Tag,
    baseHref: "/posts/tags",
    pattern: { y: 22, squares: [[0, 1]] },
  },
  {
    nameKey: "categories.title",
    descriptionKey: "categories.description",
    icon: Boxes,
    baseHref: "/posts/categories",
    pattern: { y: 12, squares: [[1, 2]] },
  },
  {
    nameKey: "documentation.title",
    descriptionKey: "documentation.description",
    icon: Folder,
    baseHref: "/documentation/introduction/content",
    pattern: { y: 18, squares: [[-1, 1], [1, 2]] },
  },
];

type WordPressStarterCardProps = {
  link: LinkItem;
};

function WordPressStarterCard({ link }: WordPressStarterCardProps) {
  const wordPressStarterCardRef = useRef<HTMLDivElement | null>(null);

  let mouseX: MotionValue<number> = useMotionValue(100);
  let mouseY: MotionValue<number> = useMotionValue(50);

  const linkAriaLabelDescription: string = `${link.name} ${link.description}`;

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    if (wordPressStarterCardRef.current) {
      const { width, height } = wordPressStarterCardRef.current.getBoundingClientRect();
      mouseX.set(width / 2);
      mouseY.set(height / 2);
    }
  }, [mouseX, mouseY]);

  return (
    <div
      ref={wordPressStarterCardRef}
      key={link.name}
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
      aria-label={linkAriaLabelDescription}
    >
      <FeaturePattern {...link.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div
        className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" 
        aria-label={linkAriaLabelDescription}
      />
      <div className="relative rounded-2xl px-4 pb-4 pt-28" aria-label={linkAriaLabelDescription}>
        <div className="absolute top-5 left-4" aria-label={linkAriaLabelDescription}>
          <FeatureIcon icon={link.icon} aria-label={linkAriaLabelDescription} />
        </div>
        <h3
          className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white"
          aria-label={linkAriaLabelDescription}
        >
          <Link href={link.href}>
            <span className="absolute inset-0 rounded-2xl" aria-label={linkAriaLabelDescription} />
            {link.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400" aria-label={linkAriaLabelDescription}>
          {link.description}
        </p>
      </div>
    </div>
  );
}

export default function WordPressStarterGrid() {
  const t = useTranslations("WordPressStarter.starterGrid");
  const locale = useLocale();

  const localizedLinks: LinkItem[] = baseLinks.map(({ baseHref, nameKey, descriptionKey, ...rest }) => {
    const withLocaleSuffix: string =
      baseHref.includes("/documentation")
        ? baseHref.replace(/([^/]+)$/, `$1-${locale}`)
        : baseHref;

    return {
      name: t(nameKey),
      description: t(descriptionKey),
      href: `/${locale}${withLocaleSuffix.startsWith("/") ? withLocaleSuffix : `/${withLocaleSuffix}`}`,
      ...rest,
    };
  });

  return (
    <div className="grid gap-4 mt-8 not-prose md:grid-cols-3">
      {localizedLinks.map((localizedLink) => (
        <WordPressStarterCard key={localizedLink.name} link={localizedLink} />
      ))}
    </div>
  );
}