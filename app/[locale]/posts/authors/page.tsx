import { Metadata } from "next";
import { getAllAuthors } from "@/lib/wordpressRequests";
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
  const authorsPageTitle: string = await translateHTML("All authors", locale);
  const authorsPageDescription: string = await translateHTML("View all authors posts", locale);

  return {
    title: authorsPageTitle,
    description: authorsPageDescription
  };
}

const Authors = async () => {
  const locale = await getLocale() as Locale;
  const authors = await getAllAuthors();
  const translatedAuthorsHeading: string = await translateHTML("All authors", locale);

  const translatedAuthors = await Promise.all(
    authors.map(async (author) => ({
      ...author,
      name: await translateHTML(author.name, locale as Locale)
    }))
  );

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>{translatedAuthorsHeading}</h2>
          <div className="grid">
            {translatedAuthors.map((translatedAuthor) => (
              <Link key={translatedAuthor.id} href={`/${locale}/posts/?author=${translatedAuthor.id}`}>
                {translatedAuthor.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Authors;