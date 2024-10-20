import { Category } from "@/types/Category";
import { Page } from "@/types/Page";
import { Post } from "@/types/Post";
import { Tag } from "@/types/Tag";
import { Author } from "@/types/Author";
import queryString from "query-string";
import { FeaturedMedia } from "@/types/FeaturedMedia";

const baseUrl: string = "http://wordpress.local";

const getUrl = (
  path: string,
  queryParametersRecord?: Record<string, any>
): string => {
  const stringifiedQueryParameters: string | null = queryParametersRecord
    ? queryString.stringify(queryParametersRecord)
    : null;
  return `${baseUrl}${path}${
    stringifiedQueryParameters ? `?${stringifiedQueryParameters}` : ""
  }`;
};

export const getAllPosts = async (filterParameters: {
  author?: string;
  tag?: string;
  category?: string;
}): Promise<Post[]> => {
  const postsUrl: string = getUrl("/wp-json/wp/v2/posts", {
    author: filterParameters?.author,
    tags: filterParameters.tag,
    categories: filterParameters.category,
  });

  console.log(postsUrl)

  const postsResponse: Response = await fetch(postsUrl);
  const posts: Post[] = await postsResponse.json();

  return posts;
};

export const getPostById = async (id: number): Promise<Post> => {
  const postByIdUrl: string = getUrl(`/wp-json/wp/v2/posts/${id}`);
  const postByIdResponse: Response = await fetch(postByIdUrl);
  const postById: Post = await postByIdResponse.json();
  return postById;
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const postBySlugUrl: string = getUrl("/wp-json/wp/v2/posts", { slug });
  const postBySlugResponse: Response = await fetch(postBySlugUrl);
  const postBySlug: Post[] = await postBySlugResponse.json();
  return postBySlug[0];
};

export const getAllCategories = async (): Promise<Category[]> => {
  const allCategoriesUrl: string = getUrl("/wp-json/wp/v2/categories");
  const allCategoriesResponse: Response = await fetch(allCategoriesUrl);
  const allCategories: Category[] = await allCategoriesResponse.json();
  return allCategories;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const categoryByIdUrl: string = getUrl(`/wp-json/wp/v2/categories/${id}`);
  const categoryByIdResponse: Response = await fetch(categoryByIdUrl);
  const categoryById: Category = await categoryByIdResponse.json();
  return categoryById;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const categoryBySlugUrl: string = getUrl("/wp-json/wp/v2/categories", {
    slug,
  });

  const categoryBySlugResponse: Response = await fetch(categoryBySlugUrl);
  const category: Category[] = await categoryBySlugResponse.json();
  
  return category[0];
};

export const getPostsByCategory = async (
  categoryId: number
): Promise<Post[]> => {
  const postsByCategoryUrl: string = getUrl("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });

  const postsByCategoryResponse: Response = await fetch(postsByCategoryUrl);
  const postsByCategory: Post[] = await postsByCategoryResponse.json();

  return postsByCategory;
};

export const getPostsByTag = async (tagId: number): Promise<Post[]> => {
  const postsByTagUrl: string = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
  const postsByTagResponse: Response = await fetch(postsByTagUrl);
  const postsByTag: Post[] = await postsByTagResponse.json();
  return postsByTag;
};

export const getAllTags = async (): Promise<Tag[]> => {
  const allTagsUrl: string = getUrl("/wp-json/wp/v2/tags");
  const allTagsResponse: Response = await fetch(allTagsUrl);
  const allTags: Tag[] = await allTagsResponse.json();
  return allTags;
};

export const getTagById = async (id: number): Promise<Tag> => {
  const tagByIdUrl: string = getUrl(`/wp-json/wp/v2/tags/${id}`);
  const tagByIdResponse: Response = await fetch(tagByIdUrl);
  const tagById: Tag = await tagByIdResponse.json();
  return tagById;
};

export const getTagBySlug = async (slug: string): Promise<Tag> => {
  const tagBySlugUrl: string = getUrl("/wp-json/wp/v2/tags", { slug });
  const tagBySlugResponse: Response = await fetch(tagBySlugUrl);
  const tagBySlug: Tag[] = await tagBySlugResponse.json();
  return tagBySlug[0];
};

export const getTagsByPost = async (postId: number): Promise<Tag[]> => {
  const tagsByPostUrl: string = getUrl("/wp-json/wp/v2/tags", { post: postId });
  const tagsByPostResponse: Response = await fetch(tagsByPostUrl);
  const tagsByPost: Tag[] = await tagsByPostResponse.json();
  return tagsByPost;
};

export const getAllPages = async (): Promise<Page[]> => {
  const allPagesUrl: string = getUrl("/wp-json/wp/v2/pages");
  const allPagesResponse: Response = await fetch(allPagesUrl);
  const allPages: Page[] = await allPagesResponse.json();
  return allPages;
};

export const getPageById = async (id: number): Promise<Page> => {
  const pageByIdUrl: string = getUrl(`/wp-json/wp/v2/pages/${id}`);
  const pageByIdResponse: Response = await fetch(pageByIdUrl);
  const pageById: Page = await pageByIdResponse.json();
  return pageById;
};

export const getPageBySlug = async (slug: string): Promise<Page> => {
  const pageBySlugUrl: string = getUrl("/wp-json/wp/v2/pages", { slug });
  const pageBySlugResponse: Response = await fetch(pageBySlugUrl);
  const pageBySlug: Page[] = await pageBySlugResponse.json();
  return pageBySlug[0];
};

export const getAllAuthors = async (): Promise<Author[]> => {
  const allAuthorsUrl: string = getUrl("/wp-json/wp/v2/users");
  const allAuthorsResponse: Response = await fetch(allAuthorsUrl);
  const allAuthors: Author[] = await allAuthorsResponse.json();
  return allAuthors;
};

export const getAuthorById = async (id: number): Promise<Author> => {
  const authorByIdUrl: string = getUrl(`/wp-json/wp/v2/users/${id}`);
  const authorByIdResponse: Response = await fetch(authorByIdUrl);
  const authorById: Author = await authorByIdResponse.json();
  return authorById;
};

export const getAuthorBySlug = async (slug: string): Promise<Author> => {
  const authorBySlugUrl: string = getUrl("/wp-json/wp/v2/users", { slug });
  const authorBySlugResponse: Response = await fetch(authorBySlugUrl);
  const authorBySlug: Author[] = await authorBySlugResponse.json();
  return authorBySlug[0];
};

export const getPostsByAuthorId = async (authorId: number): Promise<Post[]> => {
  const postsByAuthorIdUrl: string = getUrl("/wp-json/wp/v2/posts", {
    author: authorId,
  });

  const postsByAuthorIdResponse: Response = await fetch(postsByAuthorIdUrl);
  const postsByAuthorId: Post[] = await postsByAuthorIdResponse.json();

  return postsByAuthorId;
};

export const getPostsByAuthorSlug = async (
  authorSlug: string
): Promise<Post[]> => {
  const authorBySlug: Author = await getAuthorBySlug(authorSlug);

  const postsByAuthorSlugUrl: string = getUrl("/wp-json/wp/v2/posts", {
    author: authorBySlug.id,
  });

  const postsByAuthorSlugResponse: Response = await fetch(postsByAuthorSlugUrl);
  const postsByAuthorSlug: Post[] = await postsByAuthorSlugResponse.json();

  return postsByAuthorSlug;
};

export const getPostsByCategorySlug = async (
  categorySlug: string
): Promise<Post[]> => {
  const categoryBySlug: Category = await getCategoryBySlug(categorySlug);

  const postsByCategorySlugUrl = getUrl("/wp-json/wp/v2/posts", {
    categories: categoryBySlug.id,
  });

  const postsByCategorySlugResponse = await fetch(postsByCategorySlugUrl);
  const postsByCategorySlug: Post[] = await postsByCategorySlugResponse.json();

  return postsByCategorySlug;
};

export const getPostsByTagSlug = async (tagSlug: string): Promise<Post[]> => {
  const tagBySlug: Tag = await getTagBySlug(tagSlug);

  const postsByTagSlugUrl = getUrl("/wp-json/wp/v2/posts", {
    tags: tagBySlug.id,
  });

  const postsByTagSlugResponse = await fetch(postsByTagSlugUrl);
  const postsByTagSlug: Post[] = await postsByTagSlugResponse.json();

  return postsByTagSlug;
};

export const getFeaturedMediaById = async (
  id: number
): Promise<FeaturedMedia> => {
  const featuredMediaByIdUrl = getUrl(`/wp-json/wp/v2/media/${id}`);
  const featuredMediaByIdResponse = await fetch(featuredMediaByIdUrl);
  const featuredMediaById: FeaturedMedia = await featuredMediaByIdResponse.json();
  return featuredMediaById;
};