import { Metadata } from "next";
import { getAllCategories } from "@/lib/wordpressRequests";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Link from "next/link";
import BackButton from "@/components/back-button/back-button";
import Main from "@/components/main/main";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Всички категории",
    description: "Вижте всички категории на публикации"
  };
}

const Categories = async () => {
  const categories = (await getAllCategories()).sort((a, b) => {
    if (a.name === 'Uncategorized') {
      return 1;
    }

    if (b.name === 'Uncategorized') {
      return -1;
    }

    return a.name.localeCompare(b.name, 'bg');
  });

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Всички категории</h2>
          <div className="grid">
            {categories.map((category) => (
              <Link key={category.id} href={`/posts/?category=${category.id}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}

export default Categories;