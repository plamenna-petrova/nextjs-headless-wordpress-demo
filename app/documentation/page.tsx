import glob from 'fast-glob'

import { type Section } from '@/components/documentation/SectionProvider';
import { Layout } from '@/components/documentation/Layout';

export default async function Documentation({ children }: { children: React.ReactNode }) {
  let pages = await glob('**/*.mdx', { cwd: 'app' });

  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <div className="w-full mx-auto">
      <Layout allSections={allSections}>{children}</Layout>
    </div>
  );
}