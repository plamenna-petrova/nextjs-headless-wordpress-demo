import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

import { getAllAuthors, getAllCategories, getAllPosts, getAllTags } from "@/lib/wordpressRequests";

import Container from "@/components/container/container";
import PostCard from "@/components/posts/post-card";
import Section from "@/components/section/section";
import PostsFilter from "@/components/posts/posts-filter";
import Main from "@/components/main/main";
import { PostsSearchInput } from "@/components/posts/posts-search-input";

const Posts = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { search, author, tag, category, page } = searchParams;

  const posts = await getAllPosts({ search, author, tag, category });

  const authors = await getAllAuthors();
  const tags = await getAllTags();
  const categories = await getAllCategories();

  const currentPage: number = page ? parseInt(page, 10) : 1;
  const postsPerPage: number = 9;
  const totalPages: number = Math.ceil(posts.length / postsPerPage);

  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const createPaginationUrl = (page: number): string => {
    const urlSearchParams: URLSearchParams = new URLSearchParams();

    if (page > 1) {
      urlSearchParams.set("page", page.toString());
    }

    if (search) {
      urlSearchParams.set("search", search);
    }

    if (category) {
      urlSearchParams.set("category", category);
    }

    if (author) {
      urlSearchParams.set("author", author);
    }

    if (tag) {
      urlSearchParams.set("tag", tag);
    }

    return `/posts${searchParams.toString() ? `?${urlSearchParams.toString()}` : ''}`;
  }

  return (
    <Main>
      <Section>
        <Container>
          <h1>Posts</h1>

          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found
            {search && 'matching your search'}
          </p>

          <div className="space-y-4">
            <PostsSearchInput defaultValue={search} />

            <PostsFilter
              authors={authors}
              tags={tags}
              categories={categories}
              selectedAuthor={author}
              selectedTag={tag}
              selectedCategory={category}
            />
          </div>

          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4 z-0">
              {paginatedPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>No Posts Found</p>
            </div>
          )}
          <div className="mt-8 not-prose">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={currentPage === 1 ? "pointer-events-none" : ""}
                    href={createPaginationUrl(currentPage - 1)}
                  />
                </PaginationItem>
                <PaginationItem className="text-zinc-100">
                  <PaginationLink href={createPaginationUrl(currentPage)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages ? "pointer-events-none" : ""
                    }
                    href={createPaginationUrl(currentPage + 1)}
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