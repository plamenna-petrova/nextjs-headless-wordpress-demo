import { getAllPages } from "@/lib/wordpressRequests";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import Main from "@/components/main/main";
import BackButton from "@/components/back-button/back-button";

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Всички страници</h2>
          <div className="grid">
            {pages.map((page: any) => (
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