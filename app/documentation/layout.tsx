import glob from 'fast-glob';
import { type Section } from '@/components/documentation/SectionProvider';
import { DocumentationLayout } from '@/components/documentation/DocumentationLayout';

export default async function Documentation({ children }: { children: React.ReactNode }) {
  // Glob all MDX files from root
  let pages = await glob('documentation/**/*.mdx');

  console.log('Pages:', pages); // Debugging: Verify paths

  // Use dynamic import based on root-relative paths
  let documentationSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections, // Import based on app as root
    ]),
  )) as Array<[string, Array<Section>]>;

  // Convert entries to an object
  let documentationSections = Object.fromEntries(documentationSectionsEntries);

  return (
    <div className="w-full mx-auto">
      <DocumentationLayout allSections={documentationSections}>
        {children}
      </DocumentationLayout>
    </div>
  );
}
