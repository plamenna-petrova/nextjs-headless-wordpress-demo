import { getAllTags } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Всички етикети",
    description: "Вижте всички етикети на етикети"
  };
}

const Tags = async () => {
  const tags = await getAllTags();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Всички етикети</h2>
          <div className="grid">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/posts/?tag=${tag.id}`}>
                {tag.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Tags;