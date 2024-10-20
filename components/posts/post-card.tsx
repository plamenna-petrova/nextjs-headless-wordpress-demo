import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/Post";
import { mergeClassNames } from "@/lib/utils";
import { getFeaturedMediaById, getCategoryById } from "@/lib/wordpressRequests";

const PostCard = async ({ post }: { post: any }) => {
    console.log("in post card");
    console.log(post);

    const postFeaturedMedia = await getFeaturedMediaById(post.featured_media);

    const date = new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const postCategory = post.categories ? await getCategoryById(post.categories[0]) : undefined;

    return (
        <Link
            href={`/posts/${post.slug}`}
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
                        alt={post.title}
                        width={400}
                        height={200}
                    />
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: post.title }}
                    className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
                ></div>
                <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: `${post.excerpt.split(" ").slice(0, 12).join(" ").trim()}...` }}
                ></div>
            </div>
            <div className="flex flex-col gap-4">
                <hr />
                <div className="flex justify-between items-center text-xs">
                    <p>{postCategory?.name}</p>
                    <p>{date}</p>
                </div>
            </div>
        </Link>
    )
}

export default PostCard;