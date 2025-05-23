'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { useSectionStore } from './SectionProvider'
import { Tag } from './Tag'
import { convertRemToPx } from '@/lib/remToPx'

import Link from 'next/link'

const AnchorIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6.5 11.5-.964-.964a3.535 3.535 0 1 1 5-5l.964.964m2 2 .964.964a3.536 3.536 0 0 1-5 5L8.5 13.5m0-5 3 3" />
    </svg>
  )
}

interface EyebrowProps {
  tag?: string; 
  label?: string;
}

const Eyebrow = ({ tag, label }: EyebrowProps) => {
  if (!tag && !label) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-3">
      {tag && <Tag>{tag}</Tag>}
      {tag && label && (
        <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      )}
      {label && (
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      )}
    </div>
  )
}

interface AnchorProps {
  id: string;
  isInView: boolean;
  children: React.ReactNode;
}

const Anchor = ({ id, isInView, children }: AnchorProps) => {
  return (
    <Link
      href={`#${id}`}
      className="group text-inherit no-underline hover:text-inherit"
    >
      {isInView && (
        <div className="absolute ml-[calc(-1*var(--width))] mt-1 hidden w-[var(--width)] opacity-0 transition [--width:calc(2.625rem+0.5px+50%-min(50%,calc(theme(maxWidth.lg)+theme(spacing.8))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:theme(spacing.10)]">
          <div className="group/anchor block h-5 w-5 rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-300 transition hover:ring-zinc-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600">
            <AnchorIcon className="h-5 w-5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white" />
          </div>
        </div>
      )}
      {children}
    </Link>
  )
}

interface HeadingProps {
  id: string;
  tag?: string;
  label?: string;
  level?: number;
  anchor?: boolean
}

export function Heading<Level extends 2 | 3>({
  children,
  tag,
  label,
  level,
  anchor = true,
  ...props
}: React.ComponentPropsWithoutRef<`h${Level}`> & HeadingProps) {
  let currentLevel: number = level ?? (2 as Level);
  let HeadingComponent = `h${level}` as 'h2' | 'h3';
  let ref = useRef<HTMLHeadingElement>(null);
  let registerHeading = useSectionStore((s) => s.registerHeading);

  let isAnchorInView: boolean = useInView(ref, {
    margin: `${convertRemToPx(-3.5)}px 0px 0px 0px`,
    amount: 'all',
  });

  useEffect(() => {
    if (currentLevel === 2) {
      registerHeading({ id: props.id, ref, offsetRem: tag || label ? 8 : 6 });
    }
  });

  return (
    <>
      <Eyebrow tag={tag} label={label} />
      <HeadingComponent
        ref={ref}
        className={tag || label ? 'mt-2 scroll-mt-32' : 'scroll-mt-24'}
        {...props}
      >
        {anchor ? (
          <Anchor id={props.id} isInView={isAnchorInView }>
            {children}
          </Anchor>
        ) : (
          children
        )}
      </HeadingComponent>
    </>
  )
}
