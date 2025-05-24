import { getAllPages } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { translateHTML } from "@/lib/translateHTML";
import { Locale } from "@/lib/i18n";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import Main from "@/components/main/main";
import BackButton from "@/components/back-button/back-button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale() as Locale;
  const translatedPagesTitle: string = await translateHTML("All pages", locale);
  const translatedPagesDescription: string = await translateHTML("View all pages", locale);

  return {
    title: translatedPagesTitle,
    description: translatedPagesDescription
  };
}

export default async function Page() {
  const locale = await getLocale() as Locale;
  const pages = await getAllPages();
  const translatedPagesHeading: string = await translateHTML("All pages", locale);

  const translatedPages = await Promise.all(
    pages.map(async (page) => ({
      ...page,
      title: {
        ...page.title,
        rendered: await translateHTML(page.title.rendered, locale)
      }
    }))
  );

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>{translatedPagesHeading}</h2>
          <div className="grid">
            {translatedPages.map((translatedPage) => (
              <Link key={translatedPage.id} href={`/${locale}/pages/${translatedPage.slug}`}>
                {translatedPage.title.rendered}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}