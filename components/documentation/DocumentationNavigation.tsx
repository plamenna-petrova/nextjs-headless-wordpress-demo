'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { useIsInsideMobileNavigation } from '@/components/documentation/DocumentationMobileNavigation'
import { useSectionStore } from './SectionProvider'
import { Tag } from './Tag'
import { convertRemToPx } from '@/lib/remToPx'
import { useLocale, useTranslations } from 'next-intl'

import clsx from 'clsx'
import Link from 'next/link'

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  tag?: string;
  active?: boolean;
  isAnchorLink?: boolean;
}

const NavLink = ({ href, children, tag, active = false, isAnchorLink = false }: NavLinkProps) => {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

interface NavigationGroup {
  title?: string;
  titleKey: string;
  links: Array<{ title?: string, titleKey: string; href: string }>;
}

interface VisibleSectionHighlightProps {
  navigationGroup: NavigationGroup;
  pathname: string;
}

const VisibleSectionHighlight = ({ navigationGroup, pathname }: VisibleSectionHighlightProps) => {
  let sections = useSectionStore((s) => s.sections);
  let visibleSections = useSectionStore((s) => s.visibleSections);

  let isPresent: boolean = useIsPresent();

  let firstVisibleSectionIndex: number = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  );

  let navigationItemHeight: number = convertRemToPx(2);

  let height: number = isPresent ? Math.max(1, visibleSections.length) * navigationItemHeight : navigationItemHeight;
  let foundLinkIndex: number = navigationGroup.links.findIndex((link) => link.href === pathname);
  let top: number = foundLinkIndex * navigationItemHeight + firstVisibleSectionIndex * navigationItemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

interface ActivePageMarkerProps {
  navigationGroup: NavigationGroup;
  pathname: string;
}

const ActivePageMarker = ({ navigationGroup, pathname }: ActivePageMarkerProps) => {
  let navigationItemHeight: number = convertRemToPx(2);
  let offset: number = convertRemToPx(0.25);

  let activePageIndex: number = navigationGroup.links.findIndex((link) => link.href === pathname);
  let top: number = offset + activePageIndex * navigationItemHeight;

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-blue-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

interface NavigationGroupProps {
  navigationGroup: NavigationGroup;
  className?: string;
}

const NavigationGroupListItem = ({ navigationGroup, className }: NavigationGroupProps) => {
  let pathname: string = usePathname();
  let sections = useSectionStore((s) => s.sections);
  let isInsideMobileNavigation: boolean = useIsInsideMobileNavigation();
  let isNavigationGroupActive: boolean = navigationGroup.links.findIndex((link) => link.href === pathname) !== -1;

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {navigationGroup.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isNavigationGroupActive && (
            <VisibleSectionHighlight navigationGroup={navigationGroup} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isNavigationGroupActive && (
            <ActivePageMarker navigationGroup={navigationGroup} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {navigationGroup.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigationGroups: Array<NavigationGroup> = [
  {
    titleKey: 'guides',
    links: [
      { titleKey: 'introduction', href: '/documentation/introduction' },
      { titleKey: 'corePrinciples', href: '/documentation/core-principles' },
      { titleKey: 'aboutTheApplication', href: '/documentation/about-the-application'}
    ],
  },
  {
    titleKey: 'reference',
    links: [
      { titleKey: 'usedFunctions', href: '/documentation/rest-api-functions' }
    ]
  }
];

export const DocumentationNavigation = (props: React.ComponentPropsWithoutRef<'nav'>) => {
  const t = useTranslations("Documentation");
  const locale = useLocale();

  const localizedNavigationGroups: Array<NavigationGroup> = navigationGroups.map((navigationGroup) => ({
    ...navigationGroup,
    title: t(navigationGroup.titleKey),
    links: navigationGroup.links.map((link) => ({
      ...link,
      title: t(link.titleKey),
      href: `/${locale}${link.href}/content-${locale}` 
    }))
  }));

  return (
    <nav {...props}>
      <ul role="list">
        {localizedNavigationGroups.map((localizedNavigationGroup, localizedNavigationGroupIndex) => (
          <NavigationGroupListItem
            key={localizedNavigationGroup.title}
            navigationGroup={localizedNavigationGroup}
            className={localizedNavigationGroupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
      </ul>
    </nav>
  )
}