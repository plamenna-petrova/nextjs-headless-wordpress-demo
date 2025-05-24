import { getPostBySlug, getFeaturedMediaById, getAuthorById, getCategoryById, getTagsByPost } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import { badgeVariants } from "@/components/ui/badge";
import { mergeClassNames } from "@/lib/utils";
import { translateHTML } from "@/lib/translateHTML";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Article from "@/components/article/article";
import SEOPageMetadata from "@/components/seo/SEOPageMetadata";
import { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }): Promise<Metadata> {
  const postBySlug = await getPostBySlug(params.slug);
  const postBySlugTitle: string = await translateHTML(postBySlug.title.rendered, params.locale as Locale);
  const postBySlugExcerpt: string = await translateHTML(postBySlug.excerpt.rendered, params.locale as Locale);

  return {
    title: postBySlugTitle,
    description: postBySlugExcerpt,
  };
}

export default async function Page({ params }: { params: { slug: string, locale: string } }) {
  const postBySlug = await getPostBySlug(params.slug);
  const featuredMedia = await getFeaturedMediaById(postBySlug.featured_media);
  const author = await getAuthorById(postBySlug.author);
  const category = await getCategoryById(postBySlug.categories[0]);
  const tags = await getTagsByPost(postBySlug.id);
  const tagNames: string[] = tags.map((tag) => tag.name);

  const translatedPostTitle: string = await translateHTML(postBySlug.title.rendered, params.locale as Locale);
  const translatedPostExcerpt: string = await translateHTML(postBySlug.excerpt.rendered, params.locale as Locale);
  const translatedPostContent: string = await translateHTML(postBySlug.content.rendered, params.locale as Locale);

  const postUrl = `${process.env.WORDPRESS_INSTANCE_BASE_URL}/posts/${postBySlug.slug}`;

  const postBySlugDateLocaleString: string = new Date(postBySlug.date).toLocaleDateString("bg-BG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <SEOPageMetadata
        title={translatedPostTitle}
        description={translatedPostExcerpt}
        url={postUrl}
        image={featuredMedia.source_url}
        type="article"
        publishedTime={postBySlugDateLocaleString}
        modifiedTime={postBySlugDateLocaleString}
        tags={tagNames}
      />
      <Main>
        <Section>
          <Container>
            <h1>
              <Balancer>
                <span dangerouslySetInnerHTML={{ __html: translatedPostTitle }}></span>
              </Balancer>
            </h1>
            <div className="flex justify-between items-center gap-4 text-sm mb-4">
              <h5>
                Публикувано на {postBySlugDateLocaleString} от{" "}
                {author.name && (
                  <span>
                    <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                  </span>
                )}
              </h5>
              <Link
                href={`/posts/?category=${category.id}`}
                className={mergeClassNames(badgeVariants({ variant: "outline" }), "not-prose")}
              >
                {category.name}
              </Link>
            </div>
            <div className="h-96 my-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
              <img
                className="h-full w-full"
                src={featuredMedia.source_url}
                alt={postBySlug.title.rendered}
              />
            </div>
            <div className="flex w-full justify-center text-justify">
              <Article dangerouslySetInnerHTML={{ __html: translatedPostContent }} />
            </div>
          </Container>
        </Section>
      </Main>
    </>
  );
}