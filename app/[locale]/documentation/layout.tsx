import { type Section } from '@/components/documentation/SectionProvider';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';
import { getLocale } from 'next-intl/server';
import { Locale } from '@/lib/i18n';
import { mdxPages } from './manifest';

export default async function Documentation({ children }: { children: React.ReactNode }) {
  const locale = await getLocale() as Locale;
  const mdxPagesForCurrentLocale = mdxPages[locale as keyof typeof mdxPages];

  const documentationSectionsEntries = (await Promise.all(
    Object.entries(mdxPagesForCurrentLocale).map(async ([filename, importer]) => {
      const normalizedMDXPagePath: string = filename.replace(/(^|\/)page\.mdx$/, '');

      const fullMDXPagePath: string = normalizedMDXPagePath
        ? `/${locale}/documentation/${normalizedMDXPagePath}`
        : `/${locale}/documentation`;
      
      const mdxModule = await importer();

      const sections = (mdxModule as any).sections ?? [];
      return [fullMDXPagePath, sections] as [string, Section[]];
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
