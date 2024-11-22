import { Category } from "@/types/Category";
import { Page } from "@/types/Page";
import { Post } from "@/types/Post";
import { Tag } from "@/types/Tag";
import { Author } from "@/types/Author";
import { FeaturedMedia } from "@/types/FeaturedMedia";
import { AN_UNKNOWN_ERROR_OCCURRED } from "./constants";
import queryString from "query-string";

const baseUrl: string = "http://localhost/wordpress/";

const getUrl = (
  path: string,
  queryParametersRecord?: Record<string, any>
): string => {
  const stringifiedQueryParameters: string | null = queryParametersRecord
    ? queryString.stringify(queryParametersRecord)
    : null;

  return `${baseUrl}${path}${stringifiedQueryParameters ? `?${stringifiedQueryParameters}` : ""}`;
};

export const getAllPosts = async (
  filterParameters: {
    author?: string;
    tag?: string;
    category?: string;
  },
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const postsUrl: string = getUrl("/wp-json/wp/v2/posts", {
      author: filterParameters?.author,
      tags: filterParameters.tag,
      categories: filterParameters.category,
    });

    const postsResponse: Response = await fetch(postsUrl, options);
    const posts: Post[] = await postsResponse.json();

    return posts;
  } catch (error: unknown) {
    console.log("Error fetching posts:", error);
    throw new Error(`Unable to retrieve posts. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post> => {
  try {
    const postByIdUrl: string = getUrl(`/wp-json/wp/v2/posts/${id}`);
    const postByIdResponse: Response = await fetch(postByIdUrl, options);
    const postById: Post = await postByIdResponse.json();
    return postById;
  } catch (error: unknown) {
    console.log("Error fetching post by Id:", error);
    throw new Error(`Unable to retrieve post by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostBySlug = async (
  slug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post> => {
  try {
    const postBySlugUrl: string = getUrl("/wp-json/wp/v2/posts", { slug });
    const postBySlugResponse: Response = await fetch(postBySlugUrl, options);
    const postBySlug: Post[] = await postBySlugResponse.json();
    return postBySlug[0];
  } catch (error: unknown) {
    console.log("Error fetching post by slug:", error);
    throw new Error(`Unable to retrieve post by slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAllCategories = async (
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Category[]> => {
  try {
    const allCategoriesUrl: string = getUrl("/wp-json/wp/v2/categories");
    const allCategoriesResponse: Response = await fetch(allCategoriesUrl, options);
    const allCategories: Category[] = await allCategoriesResponse.json();
    return allCategories;
  } catch (error: unknown) {
    console.log("Error fetching categories:", error);
    throw new Error(`Unable to retrieve categories. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getCategoryById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Category> => {
  try {
    const categoryByIdUrl: string = getUrl(`/wp-json/wp/v2/categories/${id}`, options);
    const categoryByIdResponse: Response = await fetch(categoryByIdUrl);
    const categoryById: Category = await categoryByIdResponse.json();
    return categoryById;
  } catch (error: unknown) {
    console.log("Error fetching category by Id:", error);
    throw new Error(`Unable to retrieve category by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getCategoryBySlug = async (
  slug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Category> => {
  try {
    const categoryBySlugUrl: string = getUrl("/wp-json/wp/v2/categories", {
      slug,
    });

    const categoryBySlugResponse: Response = await fetch(categoryBySlugUrl, options);
    const category: Category[] = await categoryBySlugResponse.json();

    return category[0];
  } catch (error: unknown) {
    console.log("Error fetching category by slug:", error);
    throw new Error(`Unable to retrieve category by slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByCategory = async (
  categoryId: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const postsByCategoryUrl: string = getUrl("/wp-json/wp/v2/posts", {
      categories: categoryId,
    });

    const postsByCategoryResponse: Response = await fetch(postsByCategoryUrl, options);
    const postsByCategory: Post[] = await postsByCategoryResponse.json();

    return postsByCategory;
  } catch (error: unknown) {
    console.log("Error fetching posts by category:", error);
    throw new Error(`Unable to retrieve posts by category. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByTag = async (
  tagId: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const postsByTagUrl: string = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
    const postsByTagResponse: Response = await fetch(postsByTagUrl, options);
    const postsByTag: Post[] = await postsByTagResponse.json();
    return postsByTag;
  } catch (error: unknown) {
    console.log("Error fetching posts by tag:", error);
    throw new Error(`Unable to retrieve posts by tag. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAllTags = async (
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Tag[]> => {
  try {
    const allTagsUrl: string = getUrl("/wp-json/wp/v2/tags");
    const allTagsResponse: Response = await fetch(allTagsUrl, options);
    const allTags: Tag[] = await allTagsResponse.json();
    return allTags;
  } catch (error: unknown) {
    console.log("Error fetching tags:", error);
    throw new Error(`Unable to retrieve tags. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`)
  }
};

export const getTagById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Tag> => {
  try {
    const tagByIdUrl: string = getUrl(`/wp-json/wp/v2/tags/${id}`);
    const tagByIdResponse: Response = await fetch(tagByIdUrl, options);
    const tagById: Tag = await tagByIdResponse.json();
    return tagById;
  } catch (error: unknown) {
    console.log("Error fetching tag by Id:", error);
    throw new Error(`Unable to retrieve tag by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getTagBySlug = async (
  slug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Tag> => {
  try {
    const tagBySlugUrl: string = getUrl("/wp-json/wp/v2/tags", { slug });
    const tagBySlugResponse: Response = await fetch(tagBySlugUrl, options);
    const tagBySlug: Tag[] = await tagBySlugResponse.json();
    return tagBySlug[0];
  } catch (error: unknown) {
    console.log("Error fetching tag by slug:", error);
    throw new Error(`Unable to retrieve tag by slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getTagsByPost = async (
  postId: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Tag[]> => {
  try {
    const tagsByPostUrl: string = getUrl("/wp-json/wp/v2/tags", { post: postId });
    const tagsByPostResponse: Response = await fetch(tagsByPostUrl, options);
    const tagsByPost: Tag[] = await tagsByPostResponse.json();
    return tagsByPost;
  } catch (error: unknown) {
    console.log("Error fetching tags by post:", error);
    throw new Error(`Unable to retrieve tags by post. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAllPages = async (
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Page[]> => {
  try {
    const allPagesUrl: string = getUrl("/wp-json/wp/v2/pages");
    const allPagesResponse: Response = await fetch(allPagesUrl, options);
    const allPages: Page[] = await allPagesResponse.json();
    return allPages;
  } catch (error: unknown) {
    console.log("Error fetching pages:", error);
    throw new Error(`Unable to retrieve pages. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  } 
};

export const getPageById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Page> => {
  try {
    const pageByIdUrl: string = getUrl(`/wp-json/wp/v2/pages/${id}`);
    const pageByIdResponse: Response = await fetch(pageByIdUrl, options);
    const pageById: Page = await pageByIdResponse.json();
    return pageById;
  } catch (error: unknown) {
    console.log("Error fetching page by Id:", error);
    throw new Error(`Unable to retrieve page by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPageBySlug = async (
  slug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Page> => {
  try {
    const pageBySlugUrl: string = getUrl("/wp-json/wp/v2/pages", { slug });
    const pageBySlugResponse: Response = await fetch(pageBySlugUrl, options);
    const pageBySlug: Page[] = await pageBySlugResponse.json();
    return pageBySlug[0];
  } catch (error: unknown) {
    console.log("Error fetching page by slug:", error);
    throw new Error(`Unable to retrieve page by slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAllAuthors = async (
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Author[]> => {
  try {
    const allAuthorsUrl: string = getUrl("/wp-json/wp/v2/users");
    const allAuthorsResponse: Response = await fetch(allAuthorsUrl, options);
    const allAuthors: Author[] = await allAuthorsResponse.json();
    return allAuthors;
  } catch (error: unknown) {
    console.log("Error fetching authors:", error);
    throw new Error(`Unable to retrieve authors. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAuthorById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Author> => {
  try {
    const authorByIdUrl: string = getUrl(`/wp-json/wp/v2/users/${id}`);
    const authorByIdResponse: Response = await fetch(authorByIdUrl, options);
    const authorById: Author = await authorByIdResponse.json();
    return authorById;
  } catch (error: unknown) {
    console.log("Error fetching author by Id:", error);
    throw new Error(`Unable to retrieve author by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getAuthorBySlug = async (
  slug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Author> => {
  try {
    const authorBySlugUrl: string = getUrl("/wp-json/wp/v2/users", { slug });
    const authorBySlugResponse: Response = await fetch(authorBySlugUrl, options);
    const authorBySlug: Author[] = await authorBySlugResponse.json();
    return authorBySlug[0];
  } catch (error: unknown) {
    console.log("Error fetching author by slug:", error);
    throw new Error(`Unable to retrieve author by slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByAuthorId = async (
  authorId: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const postsByAuthorIdUrl: string = getUrl("/wp-json/wp/v2/posts", {
      author: authorId,
    });
  
    const postsByAuthorIdResponse: Response = await fetch(postsByAuthorIdUrl, options);
    const postsByAuthorId: Post[] = await postsByAuthorIdResponse.json();
  
    return postsByAuthorId;
  } catch (error: unknown) {
    console.log("Error fetching posts by author Id:", error);
    throw new Error(`Unable to retrieve posts by author Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByAuthorSlug = async (
  authorSlug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const authorBySlug: Author = await getAuthorBySlug(authorSlug);
  
    const postsByAuthorSlugUrl: string = getUrl("/wp-json/wp/v2/posts", {
      author: authorBySlug.id,
    });
  
    const postsByAuthorSlugResponse: Response = await fetch(postsByAuthorSlugUrl, options);
    const postsByAuthorSlug: Post[] = await postsByAuthorSlugResponse.json();
  
    return postsByAuthorSlug;
  } catch (error: unknown) {
    console.log("Error fetching posts by author slug:", error);
    throw new Error(`Unable to retrieve posts by author slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByCategorySlug = async (
  categorySlug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const categoryBySlug: Category = await getCategoryBySlug(categorySlug);
  
    const postsByCategorySlugUrl = getUrl("/wp-json/wp/v2/posts", {
      categories: categoryBySlug.id,
    });
  
    const postsByCategorySlugResponse = await fetch(postsByCategorySlugUrl, options);
    const postsByCategorySlug: Post[] = await postsByCategorySlugResponse.json();
  
    return postsByCategorySlug;
  } catch (error: unknown) {
    console.log("Error fetching posts by category slug:", error);
    throw new Error(`Unable to retrieve posts by category slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getPostsByTagSlug = async (
  tagSlug: string,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<Post[]> => {
  try {
    const tagBySlug: Tag = await getTagBySlug(tagSlug);
  
    const postsByTagSlugUrl = getUrl("/wp-json/wp/v2/posts", {
      tags: tagBySlug.id,
    });
  
    const postsByTagSlugResponse = await fetch(postsByTagSlugUrl, options);
    const postsByTagSlug: Post[] = await postsByTagSlugResponse.json();
  
    return postsByTagSlug;
  } catch (error: unknown) {
    console.log("Error fetching posts by tag slug:", error);
    throw new Error(`Unable to retrieve posts by tag slug. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};

export const getFeaturedMediaById = async (
  id: number,
  options: { next: { revalidate: number } } = { next: { revalidate: 60 } }
): Promise<FeaturedMedia> => {
  try {
    const featuredMediaByIdUrl = getUrl(`/wp-json/wp/v2/media/${id}`);
    const featuredMediaByIdResponse = await fetch(featuredMediaByIdUrl, options);
    const featuredMediaById: FeaturedMedia = await featuredMediaByIdResponse.json();
    return featuredMediaById;
  } catch (error: unknown) {
    console.log("Error fetching featured media by Id:", error);
    throw new Error(`Unable to retrieve featured media by Id. ${error instanceof Error ? error.message : AN_UNKNOWN_ERROR_OCCURRED}`);
  }
};