import { Button } from '@/components/documentation/Button'
import { Heading } from '@/components/documentation/Heading'

interface Technology {
  href: string;
  name: string;
  description?: string;
}

const technologies: Technology[] = [
  {
    href: '/documentation/key-concepts#word-press',
    name: 'WordPress'
  },
  {
    href: '/documentation/key-concepts#softuernata-ramka-next-js',
    name: 'Софтуерната рамка Next.js',
  },
  {
    href: '/documentation/key-concepts#progresivni-ueb-prilozheniya',
    name: 'Прогресивни уеб приложения'
  },
];

export function Technologies() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Технологии
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {technologies.map((technology) => (
          <div key={technology.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {technology.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {technology.description}
            </p>
            <p className="mt-4">
              <Button href={technology.href} variant="text" arrow="right">
                Прочетете повече
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}