import { Metadata } from "next";
import { getAllCategories } from "@/lib/wordpressRequests";
import { getLocale } from "next-intl/server";
import { Locale } from "@/lib/i18n";
import { translateHTML } from "@/lib/translateHTML";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale() as Locale;
  const categoriesPageTitle: string = await translateHTML("All categories", locale);
  const categoriesPageDescription: string = await translateHTML("View all categories of posts", locale);

  return {
    title: categoriesPageTitle,
    description: categoriesPageDescription
  };
}

const Categories = async () => {
  const locale = await getLocale() as Locale;
  const originalCategories = await getAllCategories();
  const uncategorizedCategoryName: string = await translateHTML('Uncategorized', locale);
  const translatedCategoriesHeading: string = await translateHTML("All categories", locale);

  const translatedCategories = (await Promise.all(
    originalCategories.map(async (category) => ({
      ...category,
      name: await translateHTML(category.name, locale)
    }))
  )).sort((a, b) => {
      if (a.name === uncategorizedCategoryName) {
        return 1;
      }

      if (b.name === uncategorizedCategoryName) {
        return -1;
      }

      return a.name.localeCompare(b.name, locale);
  });

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>{translatedCategoriesHeading}</h2>
          <div className="grid">
            {translatedCategories.map((translatedCategory) => (
              <Link key={translatedCategory.id} href={`/${locale}/posts/?category=${translatedCategory.id}`}>
                {translatedCategory.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Categories;