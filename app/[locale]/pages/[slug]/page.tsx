import { getPageBySlug } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageBySlug = await getPageBySlug(params.slug);

  return {
    title: pageBySlug.title.rendered,
    description: pageBySlug.excerpt.rendered,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const pageBySlug = await getPageBySlug(params.slug);

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h1 className="pt-12">{pageBySlug.title.rendered}</h1>
          <div dangerouslySetInnerHTML={{ __html: pageBySlug.content.rendered }} />
        </Container>
      </Section>
    </Main>
  );
}