import { type Section } from '@/components/documentation/SectionProvider';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';
import { getLocale } from 'next-intl/server';
import { Locale } from '@/lib/i18n';
import glob from 'fast-glob';

export default async function Documentation({ children }: { children: React.ReactNode }) {
  const locale = await getLocale() as Locale;

  let foundMDXPages: string[] = await glob('**/*.mdx', { cwd: `app/[locale]/documentation` });

  if (foundMDXPages.length === 0) { 
    foundMDXPages = await glob('**/*.mdx', { cwd: `app/${locale}/documentation` });
  }

  console.log('Found MDX pages:', foundMDXPages);

  const documentationSectionsEntries = (await Promise.all(
    foundMDXPages.map(async (filename: string) => {
      const normalizedMDXPagePath: string = filename.replace(/(^|\/)page\.mdx$/, '');
      const fullMDXPagePath: string = normalizedMDXPagePath
        ? `/${locale}/documentation/${normalizedMDXPagePath}`
        : `/${locale}/documentation`;
      
      const mdxModule = await import(`./${filename}`);

      return [fullMDXPagePath, mdxModule.sections] as [string, Section[]];
    })
  ));

  const documentationSections: { [key: string]: Section[] } = Object.fromEntries(documentationSectionsEntries);

  return (
    <div className="w-full mx-auto">
      <DocumentationLayout allSections={documentationSections}>
        {children}
      </DocumentationLayout>
    </div>
  );
}
