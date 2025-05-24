import { getPageBySlug } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { translateHTML } from "@/lib/translateHTML";
import { Locale } from "@/lib/i18n";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = await getLocale() as Locale;
  const pageBySlug = await getPageBySlug(params.slug);
  const pageBySlugTitle: string = await translateHTML(pageBySlug.title.rendered, locale);
  const pageBySlugExcerpt: string = await translateHTML(pageBySlug.excerpt.rendered, locale);

  return {
    title: pageBySlugTitle,
    description: pageBySlugExcerpt,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const locale = await getLocale() as Locale;

  const pageBySlug = await getPageBySlug(params.slug);
  const translatedPageTitle: string = await translateHTML(pageBySlug.title.rendered, locale);
  const translatedPageContent: string = await translateHTML(pageBySlug.content.rendered, locale);

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h1 className="pt-12">{translatedPageTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: translatedPageContent }} />
        </Container>
      </Section>
    </Main>
  );
}