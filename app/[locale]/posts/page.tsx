import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getAllAuthors, getAllCategories, getAllPosts, getAllTags } from "@/lib/wordpressRequests";
import { translateHTML } from "@/lib/translateHTML";
import { getLocale } from "next-intl/server";
import { Locale } from "@/lib/i18n";
import Container from "@/components/container/container";
import PostCard from "@/components/posts/post-card";
import Section from "@/components/section/section";
import PostsFilter from "@/components/posts/posts-filter";
import Main from "@/components/main/main";

const Posts = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { search, author, tag, category, page } = searchParams;
  const locale = await getLocale() as Locale;

  const posts = await getAllPosts({ search, author, tag, category });
  const authors = await getAllAuthors();
  const tags = await getAllTags();
  const originalCategories = await getAllCategories();
  const uncategorizedCategoryName: string = await translateHTML('Uncategorized', locale);

  const translatedAuthors = await Promise.all(
    authors.map(async (author) => ({
      ...author,
      name: await translateHTML(author.name, locale)
    }))
  );

  const translatedTags = await Promise.all(
    tags.map(async (tag) => ({
      ...tag,
      name: await translateHTML(tag.name, locale)
    }))
  );

  const translatedCategories = (await Promise.all(
    originalCategories.map(async (category) => ({
      ...category,
      name: await translateHTML(category.name, locale)
    }))
  )).sort((a, b) => {
    if (a.name === uncategorizedCategoryName) {
      return 1;
    }

    if (b.name === uncategorizedCategoryName) {
      return -1;
    }

    return a.name.localeCompare(b.name, locale);
  });

  const currentPage: number = page ? parseInt(page, 10) : 1;
  const postsPerPage: number = 9;
  const totalPages: number = Math.ceil(posts.length / postsPerPage);

  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const createPaginationUrl = (page: number): string => {
    const urlSearchParams: URLSearchParams = new URLSearchParams();

    if (page === 1) {
      urlSearchParams.set("page", "1");
    } else {
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

    return `/${locale}/posts${searchParams.toString() ? `?${urlSearchParams.toString()}` : ''}`;
  }

  const getPostsCountText = async (): Promise<string> => {
    if (posts.length === 0) {
      return await translateHTML("Не са намерени публикации", locale);
    } else if (posts.length === 1) {
      return await translateHTML(`1 намерена публикация${search ? ', отговаряща на търсенето' : ''}`, locale);
    } else {
      return await translateHTML(`${posts.length} намерени публикации${search ? ', отговарящи на търсенето' : ''}`, locale);
    }
  }

  const [
    translatedPostsHeading,
    translatedNoPostsText,
    translatedPostsCountText,
    translatedPostSearchInputPlaceholder
  ] = await Promise.all([
    translateHTML("Публикации", locale),
    translateHTML("Не са намерени публикации", locale),
    getPostsCountText(),
    translateHTML("Търси публикации...", locale)
  ]);

  const translatedFiltersLabels: Record<string, string> = await Promise.all([
    translateHTML("Всички етикети", locale),
    translateHTML("Всички категории", locale),
    translateHTML("Всички автори", locale),
    translateHTML("Изчисти филтрите", locale)
  ]).then(([tags, categories, authors, clearFilters]) => ({
    allTags: tags,
    allCategories: categories,
    allAuthors: authors,
    clearFilters
  }));

  const [
    translatedPreviousPageLabel,
    translatedPreviousPageAriaLabel,
    translatedNextPageLabel,
    translatedNextPageAriaLabel,
    translatedCurrentPageAriaLabel
  ] = await Promise.all([
    translateHTML("Предходна", locale),
    translateHTML("Отидете на предходната страница", locale),
    translateHTML("Следваща", locale),
    translateHTML("Отидете на следващата страница", locale),
    translateHTML(`Страница ${currentPage}`, locale)
  ]);

  return (
    <Main>
      <Section>
        <Container>
          <h1>{translatedPostsHeading}</h1>
          <p className="text-muted-foreground">
            {translatedPostsCountText}
          </p>
          <PostsFilter
            defaultSearchValue={search}
            translatedSearchPlaceholder={translatedPostSearchInputPlaceholder}
            authors={translatedAuthors}
            tags={translatedTags}
            categories={translatedCategories}
            selectedAuthor={author}
            selectedTag={tag}
            selectedCategory={category}
            filterLabels={translatedFiltersLabels}
          />
          {paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4 z-0">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>{translatedNoPostsText}</p>
            </div>
          )}
          <div className="mt-8 not-prose">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={currentPage === 1 ? "pointer-events-none" : ""}
                    href={createPaginationUrl(currentPage - 1)}
                    label={translatedPreviousPageLabel}
                    ariaLabel={translatedPreviousPageAriaLabel}
                  />
                </PaginationItem>
                <PaginationItem className="text-zinc-700 dark:text-zinc-300">
                  <PaginationLink href={createPaginationUrl(currentPage)} aria-label={translatedCurrentPageAriaLabel}>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={currentPage === totalPages ? "pointer-events-none" : ""}
                    href={createPaginationUrl(currentPage + 1)}
                    label={translatedNextPageLabel}
                    ariaLabel={translatedNextPageAriaLabel}
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