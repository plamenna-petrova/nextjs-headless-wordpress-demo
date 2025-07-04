'use client'

import { type MotionValue, motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { GridPattern } from '@/components/documentation/GridPattern'
import { Heading } from '@/components/documentation/Heading'
import { ShapesIcon } from '@/components/documentation/icons/ShapesIcon'
import { BoltIcon } from '@/components/documentation/icons/BoltIcon'
import { SquaresPlusIcon } from '@/components/documentation/icons/SquaresPlusIcon'
import { CogIcon } from '@/components/documentation/icons/CogIcon'
import { useLocale, useTranslations } from 'next-intl'

import Link from 'next/link'

interface Feature {
  name: string;
  description: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  pattern: Omit<React.ComponentPropsWithoutRef<typeof GridPattern>, 'width' | 'height' | 'x'>;
}

const baseFeatures: Array<Omit<Feature, "name" | "description" | "href"> & {
  nameKey: string;
  descriptionKey: string;
  baseHref?: string;
}> = [
  {
    nameKey: 'usedFunctions.name',
    descriptionKey: 'usedFunctions.description',
    baseHref: '/documentation/rest-api-functions',
    icon: ShapesIcon,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    nameKey: 'componentLibraries.name',
    descriptionKey: 'componentLibraries.description',
    icon: SquaresPlusIcon,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    nameKey: 'uxDesign.name',
    descriptionKey: 'uxDesign.description',
    icon: BoltIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
  {
    nameKey: 'seoStrategies.name',
    descriptionKey: 'seoStrategies.description',
    icon: CogIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
];

export function FeatureIcon({ icon: Icon }: { icon: Feature['icon'] }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-blue-300/10 dark:group-hover:ring-blue-400">
      <Icon className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-blue-300/10 dark:group-hover:stroke-blue-400" />
    </div>
  )
}

export function FeaturePattern({
  mouseX,
  mouseY,
  ...gridProps
}: Feature['pattern'] & {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  let maskImage: MotionValue<string> = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#93C5FD] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#1E3A8A] dark:to-[#1E40AF]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/10 stroke-black/20 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  )
}

function Feature({ feature }: { feature: Feature }) {
  const locale = useLocale();

  const featureAriaLabelDescription: string = `${feature.name} ${feature.description}`;

  let mouseX: MotionValue<number> = useMotionValue(0);
  let mouseY: MotionValue<number> = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLAnchorElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link
      key={feature.name}
      href={feature.href ?? `/documentation/${locale}`} 
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <FeaturePattern {...feature.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div 
        className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20"
        aria-label={featureAriaLabelDescription}
      />
      <div className="relative rounded-2xl px-4 pb-4 pt-16" aria-label={featureAriaLabelDescription}>
        <FeatureIcon icon={feature.icon} aria-label={featureAriaLabelDescription} />
        <h3 
          className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white"
          aria-label={featureAriaLabelDescription}
        >
          <div className="relative z-10 block">
            <span className="absolute inset-0 rounded-2xl" aria-label={featureAriaLabelDescription} />
            {feature.name}
          </div>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400" aria-label={featureAriaLabelDescription}>
          {feature.description}
        </p>
      </div>
    </Link>
  )
}

export function Features() {
  const t = useTranslations("Documentation.features");
  const locale = useLocale();

  const localizedFeatures: Feature[] = baseFeatures.map(({ baseHref, nameKey, descriptionKey, ...rest }) => {
    const withLocaleSuffix: string | undefined =
      baseHref ? baseHref.includes("/documentation") ? baseHref.replace(/([^/]+)$/, `$1-${locale}`) : baseHref : undefined;

    return {
      name: t(nameKey),
      description: t(descriptionKey),
      href: withLocaleSuffix
        ? `/${locale}${withLocaleSuffix.startsWith("/") ? withLocaleSuffix : `/${withLocaleSuffix}`}`
        : `/${locale}`,
      ...rest,
    };
  });

  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="features">
        {t("sectionName")}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {localizedFeatures.map((localizedFeature) => (
          <Feature key={localizedFeature.name} feature={localizedFeature} />
        ))}
      </div>
    </div>
  )
}