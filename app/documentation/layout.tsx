import glob from 'fast-glob';
import { type Section } from '@/components/documentation/SectionProvider';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';

export default async function Documentation({ children }: { children: React.ReactNode }) {
  let pages: string[] = await glob('documentation/**/*.mdx');

  let documentationSectionsEntries = (await Promise.all(
    pages.map(async (filename: string) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>;
  
  let documentationSections: { [key: string]: Section[] } = Object.fromEntries(documentationSectionsEntries);

  return (
    <div className="w-full mx-auto">
      <DocumentationLayout allSections={documentationSections}>
        {children}
      </DocumentationLayout>
    </div>
  );
}
