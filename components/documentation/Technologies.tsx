import { Button } from '@/components/documentation/Button'
import { Heading } from '@/components/documentation/Heading'
import { useTranslations } from 'next-intl';

interface Technology {
  href: string;
  name: string;
  description?: string;
}

const baseTechnologies: (Omit<Technology, "href" | "name"> & { hrefKey: string, nameKey: string })[] = [
  {
    hrefKey: 'corePrinciplesHref',
    nameKey: 'wordPress'
  },
  {
    hrefKey: 'nextJSHref',
    nameKey: 'nextJS',
  },
  {
    hrefKey: 'pwaHref',
    nameKey: 'pwa'
  },
];

export function Technologies() {
  const t = useTranslations("Documentation.technologies");

  const localizedTechnologies: Technology[] = baseTechnologies.map(({ nameKey, hrefKey, ...rest }) => ({
    ...rest,
    name: t(nameKey),
    href: t(hrefKey)
  }));

  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        {t("sectionName")}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {localizedTechnologies.map((localizedTechnology) => (
          <div key={localizedTechnology.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {localizedTechnology.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {localizedTechnology.description}
            </p>
            <p className="mt-4">
              <Button href={localizedTechnology.href} variant="text" arrow="right">
                {t("readMore")}
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}