import { getPostBySlug, getFeaturedMediaById, getAuthorById, getCategoryById, getTagsByPost } from "@/lib/wordpressRequests";
import { Metadata } from "next";
import { badgeVariants } from "@/components/ui/badge";
import { translateHTML } from "@/lib/translateHTML";
import { getLocale } from "next-intl/server";
import { Locale } from "@/lib/i18n";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import Container from "@/components/container/container";
import Article from "@/components/article/article";
import SEOPageMetadata from "@/components/seo/SEOPageMetadata";
import he from "he";
import { mergeClassNames } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = await getLocale() as Locale;
  const postBySlug = await getPostBySlug(params.slug);
  const rawPostBySlugPageTitle: string = await translateHTML(postBySlug.title.rendered, locale);
  const rawPostBySlugPageExcerpt: string = await translateHTML(postBySlug.excerpt.rendered, locale);
  const postBySlugPageTitle: string = he.decode(rawPostBySlugPageTitle);
  const postBySlugPageExcerpt: string = he.decode(rawPostBySlugPageExcerpt);

  return {
    title: postBySlugPageTitle,
    description: postBySlugPageExcerpt,
  };
}

export default async function Page({ params }: { params: { slug: string, locale: string } }) {
  const locale = await getLocale() as Locale;

  const postBySlug = await getPostBySlug(params.slug);
  const featuredMedia = await getFeaturedMediaById(postBySlug.featured_media);
  const author = await getAuthorById(postBySlug.author);
  const category = await getCategoryById(postBySlug.categories[0]);
  const tags = await getTagsByPost(postBySlug.id);
  const tagNames: string[] = tags.map((tag) => tag.name);

  const translatedPostTitle: string = await translateHTML(postBySlug.title.rendered, locale);
  const translatedPostExcerpt: string = await translateHTML(postBySlug.excerpt.rendered, locale);
  const translatedPostContent: string = await translateHTML(postBySlug.content.rendered, locale);
  const translatedPostAuthorName: string = await translateHTML(author.name, locale);
  const translatedPostFirstCategoryName: string = await translateHTML(category.name, locale);

  const translatedPostTagNames: string[] = await Promise.all(
    tagNames.map(async (tagName) => await translateHTML(tagName, locale))
  );

  const postBySlugDateLocaleString: string = new Date(postBySlug.date).toLocaleDateString("bg-BG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const translatedPostPublishedDateText: string = await translateHTML(
    `Published on ${postBySlugDateLocaleString} by`,
    locale
  );

  const postBySlugUrlForSEO: string = `${process.env.WORDPRESS_INSTANCE_BASE_URL}/${locale}/posts/${postBySlug.slug}`;

  return (
    <>
      <SEOPageMetadata
        title={translatedPostTitle}
        description={translatedPostExcerpt}
        url={postBySlugUrlForSEO}
        image={featuredMedia.source_url}
        type="article"
        publishedTime={postBySlugDateLocaleString}
        modifiedTime={postBySlugDateLocaleString}
        tags={translatedPostTagNames}
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
                {translatedPostPublishedDateText} {" "}
                {author.name && (
                  <span>
                    <a href={`/${locale}/posts/?author=${author.id}`}>{translatedPostAuthorName}</a>{" "}
                  </span>
                )}
              </h5>
              <Link
                href={`/${locale}/posts/?category=${category.id}`}
                className={mergeClassNames(badgeVariants({ variant: "outline" }), "not-prose")}
              >
                {translatedPostFirstCategoryName}
              </Link>
            </div>
            <div className="h-96 my-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
              <img className="h-full w-full" src={featuredMedia.source_url} alt={translatedPostTitle} />
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