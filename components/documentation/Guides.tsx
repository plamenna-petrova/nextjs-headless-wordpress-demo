import { Button } from '@/components/documentation/Button'
import { Heading } from '@/components/documentation/Heading'

const guides = [
  {
    href: '/documentation/quickstart',
    name: 'Quickstart',
    description: 'Learn about WordPress as a Headless CMS',
  },

  {
    href: '/documentation/rest-api-functions',
    name: 'REST API functions',
    description:
      'Learn about the used REST API functions',
  },
  {
    href: '/documentation/faq',
    name: 'Frequently Asked Questions',
    description: 'Learn more insights about working with WordPress as a Headless CMS',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}