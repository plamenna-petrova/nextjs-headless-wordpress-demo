import { getAllPages } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import Main from "@/components/main/main";
import BackButton from "@/components/back-button/back-button";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Всички страници",
    description: "Вижте всички страници"
  };
}

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Всички страници</h2>
          <div className="grid">
            {pages.map((page) => (
              <Link key={page.id} href={`pages/${page.slug}`}>
                {page.title.rendered}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}