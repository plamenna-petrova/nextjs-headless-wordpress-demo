import { getAllTags } from "@/lib/wordpressRequests";
import { Metadata } from "next";
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
  const tagsPageTitle: string = await translateHTML("All tags", locale); 
  const tagsPageDescription: string = await translateHTML("View all posts tags", locale);  

  return {
    title: tagsPageTitle,
    description: tagsPageDescription
  };
}

const Tags = async () => {
  const locale = await getLocale() as Locale;
  const tags = await getAllTags();
  const translatedTagsHeading: string = await translateHTML("All tags", locale);

  const translatedTags = await Promise.all(
    tags.map(async (tag) => ({
      ...tag,
      name: await translateHTML(tag.name, locale as Locale)
    }))
  );

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>{translatedTagsHeading}</h2>
          <div className="grid">
            {translatedTags.map((translatedTag) => (
              <Link key={translatedTag.id} href={`/${locale}/posts/?tag=${translatedTag.id}`}>
                {translatedTag.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Tags;