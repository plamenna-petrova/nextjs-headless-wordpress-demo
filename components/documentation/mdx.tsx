import React from 'react'

import Link from 'next/link'
import clsx from 'clsx'

import { Heading } from './Heading'
import { Prose } from './Prose'

export const a = Link
export { Button } from './Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/documentation/Code'

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article className="flex h-full flex-col pb-10 pt-16">
      <Prose className="flex-auto">{children}</Prose>
    </article>
  )
}

export const h2 = function H2(
  props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>,
) {
  return <Heading level={2} {...props} />
}

function InfoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-blue-500/20 bg-blue-50/50 p-4 leading-6 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/5 dark:text-blue-200 dark:[--tw-prose-links-hover:theme(colors.blue.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-blue-500 stroke-white dark:fill-blue-200/20 dark:stroke-blue-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({
  children,
  sticky = false,
}: {
  children: React.ReactNode
  sticky?: boolean
}) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24',
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({
  name,
  children,
  type,
}: {
  name: string
  children: React.ReactNode
  type?: string
}) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {type}
            </dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

export function TABLE({
  children,
  striped = true,
}: {
  children: React.ReactNode;
  striped?: boolean;
}) {
  const hasHead = React.Children.toArray(children).some(
    (child) => (child as React.ReactElement)?.type === THEAD
  );

  return (
    <div className="overflow-x-auto my-0">
      <table className="min-w-full text-left text-sm whitespace-normal border-collapse separate border-spacing-0">
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement, { striped, hasHead })
        )}
      </table>
    </div>
  );
}

export function THEAD({ children }: { children: React.ReactNode }) {
  const isEmpty = React.Children.toArray(children).every(
    (child) => React.Children.count((child as React.ReactElement).props.children) === 0
  );

  return (
    <thead
      className={clsx(
        !isEmpty && "uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 border-t"
      )}
    >
      {children}
    </thead>
  );
}

export function TBODY({
  children,
  striped = true,
  hasHead = false,
}: {
  children: React.ReactNode;
  striped?: boolean;
  hasHead?: boolean;
}) {
  return (
    <tbody className={clsx({ "border-t dark:border-neutral-600": !hasHead })}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          striped,
          index,
        })
      )}
    </tbody>
  );
}

export function TR({
  children,
  striped,
  index,
}: {
  children: React.ReactNode;
  striped?: boolean;
  index?: number;
}) {
  return (
    <tr
      className={clsx(
        "border-b border-gray-300 dark:border-neutral-600",
        "hover:bg-neutral-100 dark:hover:bg-neutral-600",
        "hover:border hover:border-gray-400 dark:hover:border-neutral-500",
        striped && index !== undefined && index % 2 !== 0
          ? "bg-neutral-50 dark:bg-neutral-800"
          : ""
      )}
    >
      {children}
    </tr>
  );
}

export function TH({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="px-6 py-4 border border-gray-300 dark:border-neutral-500"
    >
      {children}
    </th>
  );
}

export function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-6 py-4 border border-gray-300 dark:border-neutral-500 whitespace-normal break-words">
      {children}
    </td>
  );
}