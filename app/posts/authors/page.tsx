import { getAllAuthors } from "@/lib/wordpressRequests";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Authors",
    description: "Browse all authors on the site.",
  };
}

const Authors = async () => {
  const authors = await getAllAuthors();

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>All Authors</h2>
        <div className="grid">
          {authors.map((author: any) => (
            <Link key={author.id} href={`/posts/?author=${author.id}`}>
              {author.name}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default Authors;