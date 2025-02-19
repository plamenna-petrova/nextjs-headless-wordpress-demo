'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
// import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from './SectionProvider'
import { Tag } from './Tag'
import { remToPx } from '@/lib/remToPx'

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

interface NavGroup {
  title: string;
  links: Array<{ title: string, href: string }>;
}

interface VisibleSectionHighlightProps {
  group: NavGroup;
  pathname: string;
}

const VisibleSectionHighlight = ({ group, pathname }: VisibleSectionHighlightProps) => {
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

  let itemHeight: number = remToPx(2);

  let height: number = isPresent ? Math.max(1, visibleSections.length) * itemHeight : itemHeight;
  let foundLinkIndex: number = group.links.findIndex((link) => link.href === pathname);
  let top: number = foundLinkIndex * itemHeight + firstVisibleSectionIndex * itemHeight;

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
  group: NavGroup;
  pathname: string;
}

const ActivePageMarker = ({ group, pathname }: ActivePageMarkerProps) => {
  let itemHeight: number = remToPx(2);
  let offset: number = remToPx(0.25);
  let activePageIndex: number = group.links.findIndex((link) => link.href === pathname);
  let top: number = offset + activePageIndex * itemHeight;

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
  group: NavGroup;
  className?: string;
}

const NavigationGroup = ({ group, className }: NavigationGroupProps) => {
//   let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    // isInsideMobileNavigation,
  );

  let isActiveGroup = group.links.findIndex((link) => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        {/* <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence> */}
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
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

export const navigationGroups: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Quickstart', href: '/quickstart' }
    ],
  },
];

const DocumentationNavigation = (props: React.ComponentPropsWithoutRef<'nav'>) => {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/api">API</TopLevelNavItem>
        {navigationGroups.map((navigationGroup, navigationGroupIndex) => (
          <NavigationGroup
            key={navigationGroup.title}
            group={navigationGroup}
            className={navigationGroupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
      </ul>
    </nav>
  )
}