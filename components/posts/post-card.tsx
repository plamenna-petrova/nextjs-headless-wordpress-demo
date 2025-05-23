import { Post } from "@/types/Post";
import { mergeClassNames } from "@/lib/utils";
import { getFeaturedMediaById, getCategoryById } from "@/lib/wordpressRequests";
import { translateHTML } from "@/lib/translateHTML";
import { Locale } from "@/lib/i18n";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

const PostCard = async ({ post }: { post: Post }) => {
  const locale = await getLocale() as Locale;
  const postFeaturedMedia = await getFeaturedMediaById(post.featured_media);
  const postCategory = await getCategoryById(post.categories[0]);

  const translatedPostTitle: string = await translateHTML(post.title.rendered, locale);
  const translatedPostCategoryName: string = await translateHTML(postCategory.name, locale);
  
  const translatedPostExcerpt: string = await translateHTML(
    `${post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim()}...`,
    locale
  );

  const translatedPostLocalizedDateString: string = new Date(post.date).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/${locale}/posts/${post.slug}`}
      className={mergeClassNames(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          <Image
            className="h-full w-full object-cover"
            src={postFeaturedMedia.source_url}
            alt={translatedPostTitle}
            width={400}
            height={200}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: translatedPostTitle }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: translatedPostExcerpt }}
        ></div>
      </div>
      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{translatedPostCategoryName}</p>
          <p>{translatedPostLocalizedDateString}</p>
        </div>
      </div>
    </Link>
  )
}

export default PostCard;