"use client";

import { useMotionValue, MotionValue } from "framer-motion";
import { Pen, File, User, Tag, Boxes, Folder, LucideIcon } from "lucide-react";
import { FeatureIcon, FeaturePattern } from "@/components/documentation/Features";
import { useEffect, useRef } from "react";
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

const links: LinkItem[] = [
  {
    name: "Публикации",
    description: "Документирани курсови работи на студенти",
    icon: Pen,
    href: "/posts?page=1",
    pattern: { y: 16, squares: [[0, 1], [1, 3]] },
  },
  {
    name: "Страници",
    description: "Информативни страници от уебсайта на WordPress",
    icon: File,
    href: "/pages",
    pattern: { y: -6, squares: [[-1, 2], [1, 3]] },
  },
  {
    name: "Автори",
    description: "Списък на авторите на курсовите работи",
    icon: User,
    href: "/posts/authors",
    pattern: { y: 32, squares: [[0, 2], [1, 4]] },
  },
  {
    name: "Етикети",
    description: "Етикети, свързани с тематиката на курсовите работи",
    icon: Tag,
    href: "/posts/tags",
    pattern: { y: 22, squares: [[0, 1]] },
  },
  {
    name: "Категории",
    description: "Категории за класифициране на обучаемите",
    icon: Boxes,
    href: "/posts/categories",
    pattern: { y: 12, squares: [[1, 2]] },
  },
  {
    name: "Документация",
    description: "Какви са възможностите за работа с WordPress",
    icon: Folder,
    href: "/documentation",
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
    >
      <FeaturePattern {...link.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-28">
        <div className="absolute top-5 left-4">
          <FeatureIcon icon={link.icon} />
        </div>
        <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <Link href={link.href}>
            <span className="absolute inset-0 rounded-2xl" />
            {link.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {link.description}
        </p>
      </div>
    </div>
  );
}

export default function WordPressStarterGrid() {
  return (
    <div className="grid gap-4 mt-8 not-prose md:grid-cols-3">
      {links.map((link) => (
        <WordPressStarterCard key={link.name} link={link} />
      ))}
    </div>
  );
}