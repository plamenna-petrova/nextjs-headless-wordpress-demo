'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { DocumentationNavigation } from '@/components/documentation/DocumentationNavigation'
import { DocumentationHeader } from '@/components/documentation/DocumentationHeader'
import { DocumentationFooter } from '@/components/documentation/DocumentationFooter'
import { Logo } from '@/components/documentation/Logo';
import { type Section, SectionProvider } from './SectionProvider'
import Link from 'next/link'

interface DocumentationLayoutProps {
  children: React.ReactNode;
  allSections: Record<string, Array<Section>>;
}

export function DocumentationLayout({ children, allSections }: DocumentationLayoutProps) {
  let pathname: string = usePathname();

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="h-full lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
            <div className="hidden lg:flex">
              <Link href="/documentation" aria-label="Documentation">
                <Logo />
              </Link>
            </div>
            <DocumentationHeader />
            <DocumentationNavigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
          <DocumentationFooter />
        </div>
      </div>
    </SectionProvider>
  )
}