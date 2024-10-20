import Container from "@/components/container/container";
import PostCard from "@/components/posts/post-card";
import Section from "@/components/section/section";
import { getPosts } from "@/lib/postsService";

export default async function Posts() {
    const posts = await getPosts(100);

    return (
        <Section>
            <Container>
                <h1>Posts</h1>
                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4 z-0">
                        {posts.map((post: any) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
                        <p>No Results Found</p>
                    </div>
                )}
            </Container>
        </Section>
    );
}