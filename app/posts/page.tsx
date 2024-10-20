import Container from "@/components/container/container";
import Section from "@/components/section/section";
import { getAllAuthors, getAllCategories, getAllPosts, getAllTags } from "@/lib/wordpressRequests";

const Posts = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }}) => {
    const { author, tag, category, page } = searchParams;
    const posts = await getAllPosts({ author, tag, category });
    const authors = await getAllAuthors();
    const tags = await getAllTags();
    const categories = await getAllCategories();

    const currentPage: number = page ? parseInt(page, 10) : 1;
    const postsPerPage: number = 9;
    const totalPages: number = Math.ceil(posts.length / postsPerPage);

    const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    return (
        <Section>
            <Container>
                <h1>Posts</h1>
                {paginatedPosts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4 z-0">
                        {JSON.stringify(paginatedPosts, null, 2)}
                    </div>
                ) : (
                    <div>No Results</div>
                )}
            </Container>
        </Section>
    )
}

export default Posts;