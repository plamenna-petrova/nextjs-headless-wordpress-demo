import { getAllCategories } from "@/lib/wordpressRequests";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Categories",
    description: "Browse all categories on the site.",
  };
}

const Categories = async () => {
  const categories = await getAllCategories();

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>All Categories</h2>
        <div className="grid">
          {categories.map((category: any) => (
            <Link key={category.id} href={`/posts/?category=${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default Categories;