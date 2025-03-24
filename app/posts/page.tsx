import Container from "@/components/container/container";
import PostCard from "@/components/posts/post-card";
import Section from "@/components/section/section";
import PostsFilter from "./posts-filter";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getAllAuthors, getAllCategories, getAllPosts, getAllTags } from "@/lib/wordpressRequests";
import Main from "@/components/main/main";

const Posts = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
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
    <Main>
      <Section>
        <Container>
          <h1>Posts</h1>
          <PostsFilter
            authors={authors}
            tags={tags}
            categories={categories}
            selectedAuthor={author}
            selectedTag={tag}
            selectedCategory={category}
          />
          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4 z-0">
              {paginatedPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>No Results Found</p>
            </div>
          )}
          <div className="mt-8 not-prose">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={currentPage === 1 ? "pointer-events-none" : ""}
                    href={`/posts?page=${Math.max(currentPage - 1, 1)}${category ? `&category=${category}` : ""}${author ? `&author=${author}` : ""}${tag ? `&tag=${tag}` : ""}`}
                  />
                </PaginationItem>
                <PaginationItem className="text-zinc-100">
                  <PaginationLink href={`/posts?page=${currentPage}`}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages ? "pointer-events-none" : ""
                    }
                    href={`/posts?page=${Math.min(currentPage + 1, totalPages)}${category ? `&category=${category}` : ""}${author ? `&author=${author}` : ""}${tag ? `&tag=${tag}` : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Container>
      </Section>
    </Main>
  )
}

export default Posts;