import { Metadata } from "next";
import { getAllAuthors } from "@/lib/wordpressRequests";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Всички автори",
    description: "Вижте всички автори на публикации"
  };
}

const Authors = async () => {
  const authors = await getAllAuthors();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Всички автори</h2>
          <div className="grid">
            {authors.map((author) => (
              <Link key={author.id} href={`/posts/?author=${author.id}`}>
                {author.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Authors;