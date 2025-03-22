'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
// import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from './SectionProvider'
import { Tag } from './Tag'
import { convertRemToPx } from '@/lib/remToPx'

const useInitialValue = <T,>(value: T, condition = true): T => {
  let initialValueRef = useRef(value).current;
  return condition ? initialValueRef : value;
};

interface TopLevelNavItemProps {
  href: string;
  children: React.ReactNode;
}

const TopLevelNavItem = ({ href, children }: TopLevelNavItemProps)=> {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

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
  title: string;
  links: Array<{ title: string, href: string }>;
}

interface VisibleSectionHighlightProps {
  navigationGroup: NavigationGroup;
  pathname: string;
}

const VisibleSectionHighlight = ({ navigationGroup, pathname }: VisibleSectionHighlightProps) => {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    // useIsInsideMobileNavigation(),
  );

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
      className="absolute left-2 h-6 w-px bg-emerald-500"
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
//   let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    // isInsideMobileNavigation,
  );

  let isNavigationGroupActive = navigationGroup.links.findIndex((link) => link.href === pathname) !== -1;

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {navigationGroup.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence>
          {isNavigationGroupActive  && (
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
    title: 'Guides',
    links: [
      { title: 'Introduction', href: '/documentation' },
      { title: 'Quickstart', href: '/documentation/quickstart' },
    ],
  },
];

export const DocumentationNavigation = (props: React.ComponentPropsWithoutRef<'nav'>) => {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/api">API</TopLevelNavItem>
        {navigationGroups.map((navigationGroup, navigationGroupIndex) => (
          <NavigationGroupListItem
            key={navigationGroup.title}
            navigationGroup={navigationGroup}
            className={navigationGroupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
      </ul>
    </nav>
  )
}