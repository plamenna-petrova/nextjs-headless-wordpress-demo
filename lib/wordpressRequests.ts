import { Category } from "@/types/Category";
import { Page } from "@/types/Page";
import { Post } from "@/types/Post";
import { Tag } from "@/types/Tag";
import { Author } from "@/types/Author";
import { FeaturedMedia } from "@/types/FeaturedMedia";
import { 
  GET_ALL_TAGS_ERROR_DETAILS, 
  GET_ALL_CATEGORIES_ERROR_DETAILS, 
  GET_CATEGORY_BY_ID_ERROR_DETAILS, 
  GET_CATEGORY_BY_SLUG_ERROR_DETAILS, 
  GET_POST_BY_ID_ERROR_DETAILS, 
  GET_POST_BY_SLUG_ERROR_DETAILS, 
  GET_POSTS_BY_CATEGORY_ERROR_DETAILS, 
  GET_POSTS_BY_TAG_ERROR_DETAILS, 
  GET_ALL_POSTS_ERROR_DETAILS, 
  GET_TAG_BY_ID_ERROR_DETAILS,
  GET_TAG_BY_SLUG_ERROR_DETAILS,
  GET_TAGS_BY_POST_ERROR_DETAILS,
  GET_ALL_PAGES_ERROR_DETAILS,
  GET_PAGE_BY_ID_ERROR_DETAILS,
  GET_PAGE_BY_SLUG_ERROR_DETAILS,
  GET_ALL_AUTHORS_ERROR_DETAILS,
  GET_AUTHOR_BY_ERROR_DETAILS,
  GET_AUTHOR_BY_SLUG_ERROR_DETAILS,
  GET_POSTS_BY_AUTHOR_ID_ERROR_DETAILS,
  GET_POSTS_BY_AUTHOR_SLUG_ERROR_DETAILS,
  GET_POSTS_BY_CATEGORY_SLUG_ERROR_DETAILS,
  GET_POSTS_BY_TAG_SLUG_ERROR_DETAILS,
  GET_FEATURED_MEDIA_BY_ID_ERROR_DETAILS,
  UNKNOWN_ERROR_DETAILS,
  WORDPRESS_FETCH_ERROR_DETAILS
} from "./constants";
import queryString from "query-string";

const baseUrl: string = "http://localhost/wordpress/";

const userAgent: string = "Next.js PWA WordPress Client";

const getUnknownErrorDetails = (error: unknown): string => error instanceof Error ? error.message : UNKNOWN_ERROR_DETAILS;

interface FetchOptions {
  next?: {
    revalidate?: number;
    tags?: string[];
  },
  headers?: Record<string, any>
}

const defaultFetchOptions: FetchOptions = {
  next: {
    revalidate: 120,
    tags: ["wordpress"]
  }
};

const wordPressFetch = async <T>(wordPressAPIRequestURL: string, fetchOptions: FetchOptions = {}): Promise<T> => {
  try {    
    const response: Response = await fetch(wordPressAPIRequestURL, {
      ...defaultFetchOptions,
      ...fetchOptions,
      headers: {
        "User-Agent": userAgent,
        ...(fetchOptions.headers || {})
      }
    });
  
    if (!response.ok) {
      throw new Error(`WordPress API request failed: ${response.statusText}, status: ${response.status}, url: ${wordPressAPIRequestURL}`);
    }

    const responseData = await response.json() as T;
  
    return responseData;
  } catch (error: any) {
    console.log(WORDPRESS_FETCH_ERROR_DETAILS, error);
    throw error;
  }
}

const getUrl = (path: string, queryParametersRecord?: Record<string, any>): string => {
  const stringifiedQueryParameters: string | null = queryParametersRecord
    ? queryString.stringify(queryParametersRecord)
    : null;

  return `${baseUrl}${path}${stringifiedQueryParameters ? `?${stringifiedQueryParameters}` : ""}`;
};

const mergeQueryTags = (defaultQueryTags: string[] | undefined, newQueryTags: string[]): string[] => {
  const allQueryTags: string[] = [...(defaultQueryTags || []), ...newQueryTags];
  return Array.from(new Set(allQueryTags));
}

export const getAllPosts = async (
  filterParams?: {
    search?: string;
    author?: string;
    tag?: string;
    category?: string;
  }
): Promise<Post[]> => {
  try {
    const postsQuery: Record<string, any> = {};

    if (filterParams?.search) {
      postsQuery.search = filterParams.search;
    }

    if (filterParams?.author) {
      postsQuery.author = filterParams.author;
    }

    if (filterParams?.tag) {
      postsQuery.tags = filterParams.tag;
    }

    if (filterParams?.category) {
      postsQuery.categories = filterParams.category;
    }

    const postsUrl: string = getUrl("/wp-json/wp/v2/posts", postsQuery);

    const posts = wordPressFetch<Post[]>(postsUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, ["posts"])
      }
    });

    return posts;
  } catch (error: any) {
    throw new Error(`${GET_ALL_POSTS_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostById = async (id: number): Promise<Post> => {
  try {
    const postByIdUrl: string = getUrl(`/wp-json/wp/v2/posts/${id}`);

    const postById = await wordPressFetch<Post>(postByIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`post-${id}`])
      }
    });

    return postById;
  } catch (error: any) {
    throw new Error(`${GET_POST_BY_ID_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  try {
    const postBySlugUrl: string = getUrl("/wp-json/wp/v2/posts", { slug });

    const postBySlugResult = await wordPressFetch<Post[]>(postBySlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`post-${slug}`])
      }
    });

    if (!postBySlugResult || postBySlugResult.length === 0) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    return postBySlugResult[0];
  } catch (error: any) {
    throw new Error(`${GET_POST_BY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const allCategoriesUrl: string = getUrl("/wp-json/wp/v2/categories");

    const allCategories = await wordPressFetch<Category[]>(allCategoriesUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, ['categories'])
      }
    });

    return allCategories;
  } catch (error: any) {
    throw new Error(`${GET_ALL_CATEGORIES_ERROR_DETAILS} ${error.message}`);
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const categoryByIdUrl: string = getUrl(`/wp-json/wp/v2/categories/${id}`);

    const categoryById = await wordPressFetch<Category>(categoryByIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`category-${id}`])
      }
    });

    return categoryById;
  } catch (error: any) {
    throw new Error(`${GET_CATEGORY_BY_ID_ERROR_DETAILS} ${error.message}`);
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const categoryBySlugUrl: string = getUrl("/wp-json/wp/v2/categories", { slug });

    const categoryBySlugResult = await wordPressFetch<Category[]>(categoryBySlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`category-${slug}`])
      }
    })

    return categoryBySlugResult[0];
  } catch (error: unknown) {
    throw new Error(`${GET_CATEGORY_BY_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_CATEGORY_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_TAG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_ALL_TAGS_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`)
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
    throw new Error(`${GET_TAG_BY_ID_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_TAG_BY_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_TAGS_BY_POST_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_ALL_PAGES_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_PAGE_BY_ID_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_PAGE_BY_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_ALL_AUTHORS_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_AUTHOR_BY_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_AUTHOR_BY_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_AUTHOR_ID_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_AUTHOR_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_CATEGORY_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_POSTS_BY_TAG_SLUG_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
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
    throw new Error(`${GET_FEATURED_MEDIA_BY_ID_ERROR_DETAILS} ${getUnknownErrorDetails(error)}`);
  }
};