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
  WORDPRESS_FETCH_ERROR_DETAILS
} from "./constants";
import queryString from "query-string";
import nodeFetch, { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse,} from "node-fetch";
import https from "https";

const WORDPRESS_INSTANCE_BASE_URL: string = `${process.env.WORDPRESS_INSTANCE_BASE_URL}`;

const DEFAULT_APP_USER_AGENT: string = "Next.js PWA WordPress Client";

const isServer = typeof window === "undefined";

interface FetchOptions {
  next?: {
    revalidate?: number;
    tags?: string[];
  },
  headers?: Record<string, any>
}

const defaultFetchOptions: FetchOptions = {
  next: {
    revalidate: 60,
    tags: ["wordpress"]
  }
};

const wordPressFetch = async <T>(wordPressAPIRequestURL: string, fetchOptions: FetchOptions = {}): Promise<T> => {
  try {
    const response: Response = await fetch(wordPressAPIRequestURL, {
      ...defaultFetchOptions,
      ...fetchOptions,
      headers: {
        "User-Agent": DEFAULT_APP_USER_AGENT,
        ...(fetchOptions.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API request failed: ${response.statusText}` +
          `status: ${response.status}, url: ${wordPressAPIRequestURL}`
      );
    }

    const responseData = (await response.json()) as T;

    return responseData;
  } catch (error: any) {
    console.log(WORDPRESS_FETCH_ERROR_DETAILS, error);
    throw error;
  }
};

export const wordPressNodeFetch = async <T>(wordPressAPIRequestURL: string): Promise<T> => {
  try {
    const agent = isServer
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const response: NodeFetchResponse = await nodeFetch(
      wordPressAPIRequestURL,
      {
        agent,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            'Referer': "https://headless-wordpress-demo.42web.io",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `WordPress API request failed: ${response.statusText} ` +
          `status: ${response.status}, url: ${wordPressAPIRequestURL}`
      );
    }

    return (await response.json()) as T;
  } catch (error: any) {
    console.error("WORDPRESS_FETCH_ERROR", error);
    throw error;
  }
};

const getUrl = (path: string, queryParametersRecord?: Record<string, any>): string => {
  const stringifiedQueryParameters: string | null = queryParametersRecord
    ? queryString.stringify(queryParametersRecord)
    : null;

  return `${WORDPRESS_INSTANCE_BASE_URL}${path}${stringifiedQueryParameters ? `?${stringifiedQueryParameters}` : ""}`;
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
    const postsQuery: Record<string, any> = {
      embed: true,
      per_page: 100
    };

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

    const posts = wordPressNodeFetch<Post[]>(postsUrl);

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
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`post-by-id-${id}`])
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
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`post-by-slug-${slug}`])
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
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`category-by-${id}`])
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
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`category-by-slug-${slug}`])
      }
    });

    if (!categoryBySlugResult || categoryBySlugResult.length === 0) {
      throw new Error(`Category with slug "${slug}" not found`);
    }

    return categoryBySlugResult[0];
  } catch (error: any) {
    throw new Error(`${GET_CATEGORY_BY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByCategory = async (categoryId: number): Promise<Post[]> => {
  try {
    const postsByCategoryUrl: string = getUrl("/wp-json/wp/v2/posts", { categories: categoryId });

    const postsByCategory = await wordPressFetch<Post[]>(postsByCategoryUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-category-id-${categoryId}`])
      }
    });

    return postsByCategory;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_CATEGORY_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const allTagsUrl: string = getUrl("/wp-json/wp/v2/tags");

    const allTags = await wordPressFetch<Tag[]>(allTagsUrl, {
      next: {
        ...defaultFetchOptions.next?.tags,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, ['tags'])
      }
    });

    return allTags;
  } catch (error: any) {
    throw new Error(`${GET_ALL_TAGS_ERROR_DETAILS} ${error.message}`);
  }
};

export const getTagById = async (id: number): Promise<Tag> => {
  try {
    const tagByIdUrl: string = getUrl(`/wp-json/wp/v2/tags/${id}`);
  
    const tagById = await wordPressFetch<Tag>(tagByIdUrl, {
      next: {
        ...defaultFetchOptions.next?.tags,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`tag-by-${id}`])
      }
    });

    return tagById;
  } catch (error: any) {
    throw new Error(`${GET_TAG_BY_ID_ERROR_DETAILS} ${error.message}`);
  }
};

export const getTagBySlug = async (slug: string): Promise<Tag> => {
  try {
    const tagBySlugUrl: string = getUrl("/wp-json/wp/v2/tags", { slug });

    const tagBySlugResult = await wordPressFetch<Tag[]>(tagBySlugUrl, {
      next: {
        ...defaultFetchOptions.next?.tags,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`tag-by-slug-${slug}`])
      }
    });

    if (!tagBySlugResult || tagBySlugResult.length === 0) {
      throw new Error(`Tag with slug "${slug}" not found`);
    }

    return tagBySlugResult[0];
  } catch (error: any) {
    throw new Error(`${GET_TAG_BY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByTag = async (tagId: number): Promise<Post[]> => {
  try {
    const postsByTagUrl: string = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
    
    const postsByTag = await wordPressFetch<Post[]>(postsByTagUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-tag-id-${tagId}`])
      }
    });

    return postsByTag;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_TAG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getTagsByPost = async (postId: number): Promise<Tag[]> => {
  try {
    const tagsByPostUrl: string = getUrl("/wp-json/wp/v2/tags", { post: postId });

    const tagsByPost = await wordPressFetch<Tag[]>(tagsByPostUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`tags-by-post-id-${postId}`])
      }
    });

    return tagsByPost;
  } catch (error: any) {
    throw new Error(`${GET_TAGS_BY_POST_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAllPages = async (): Promise<Page[]> => {
  try {
    const allPagesUrl: string = getUrl("/wp-json/wp/v2/pages");

    const allPages = await wordPressFetch<Page[]>(allPagesUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, ['pages'])
      }
    });

    return allPages;
  } catch (error: any) {
    throw new Error(`${GET_ALL_PAGES_ERROR_DETAILS} ${error.message}`);
  } 
};

export const getPageById = async (id: number): Promise<Page> => {
  try {
    const pageByIdUrl: string = getUrl(`/wp-json/wp/v2/pages/${id}`);

    const pageById = await wordPressFetch<Page>(pageByIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`page-by-id-${id}`])
      }
    });

    return pageById;
  } catch (error: any) {
    throw new Error(`${GET_PAGE_BY_ID_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPageBySlug = async (slug: string): Promise<Page> => {
  try {
    const pageBySlugUrl: string = getUrl("/wp-json/wp/v2/pages", { slug });

    const pageBySlugResult = await wordPressFetch<Page[]>(pageBySlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`page-by-slug-${slug}`])
      }
    });

    if (!pageBySlugResult || pageBySlugResult.length === 0) {
      throw new Error(`Page with slug "${slug}" not found`);
    }

    return pageBySlugResult[0];
  } catch (error: any) {
    throw new Error(`${GET_PAGE_BY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAllAuthors = async (): Promise<Author[]> => {
  try {
    const authorsQuery: Record<string, any> = {
      per_page: 100
    };

    const allAuthorsUrl: string = getUrl("/wp-json/wp/v2/users", authorsQuery);

    const allAuthors = await wordPressFetch<Author[]>(allAuthorsUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, ['authors'])
      }
    });

    return allAuthors;
  } catch (error: any) {
    throw new Error(`${GET_ALL_AUTHORS_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAuthorById = async (id: number): Promise<Author> => {
  try {
    const authorByIdUrl: string = getUrl(`/wp-json/wp/v2/users/${id}`);

    const authorById = await wordPressFetch<Author>(authorByIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`author-by-id-${id}`])
      }
    });

    return authorById;
  } catch (error: any) {
    throw new Error(`${GET_AUTHOR_BY_ERROR_DETAILS} ${error.message}`);
  }
};

export const getAuthorBySlug = async (slug: string): Promise<Author> => {
  try {
    const authorBySlugUrl: string = getUrl("/wp-json/wp/v2/users", { slug });

    const authorBySlugResult = await wordPressFetch<Author[]>(authorBySlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`author-by-slug-${slug}`])
      }
    });

    return authorBySlugResult[0];
  } catch (error: any) {
    throw new Error(`${GET_AUTHOR_BY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByAuthorId = async (authorId: number): Promise<Post[]> => {
  try {
    const postsByAuthorIdUrl: string = getUrl("/wp-json/wp/v2/posts", { author: authorId });

    const postsByAuthorId = await wordPressFetch<Post[]>(postsByAuthorIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-author-id-${authorId}`])
      }
    });
  
    return postsByAuthorId;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_AUTHOR_ID_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByAuthorSlug = async (authorSlug: string): Promise<Post[]> => {
  try {
    const authorBySlug: Author = await getAuthorBySlug(authorSlug);
  
    const postsByAuthorSlugUrl: string = getUrl("/wp-json/wp/v2/posts", { author: authorBySlug.id });

    const postsByAuthorSlug = await wordPressFetch<Post[]>(postsByAuthorSlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-author-slug-${authorBySlug}`])
      }
    });
  
    return postsByAuthorSlug;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_AUTHOR_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByCategorySlug = async (categorySlug: string): Promise<Post[]> => {
  try {
    const categoryBySlug: Category = await getCategoryBySlug(categorySlug);
  
    const postsByCategorySlugUrl: string = getUrl("/wp-json/wp/v2/posts", { categories: categoryBySlug.id });

    const postsByCategorySlug = await wordPressFetch<Post[]>(postsByCategorySlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-category-slug-${categorySlug}`])
      }
    });
  
    return postsByCategorySlug;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_CATEGORY_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getPostsByTagSlug = async (tagSlug: string): Promise<Post[]> => {
  try {
    const tagBySlug: Tag = await getTagBySlug(tagSlug);
  
    const postsByTagSlugUrl = getUrl("/wp-json/wp/v2/posts", { tags: tagBySlug.id });

    const postsByTagSlug = await wordPressFetch<Post[]>(postsByTagSlugUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`posts-by-tag-slug-${tagSlug}`])
      }
    });
  
    return postsByTagSlug;
  } catch (error: any) {
    throw new Error(`${GET_POSTS_BY_TAG_SLUG_ERROR_DETAILS} ${error.message}`);
  }
};

export const getFeaturedMediaById = async (id: number): Promise<FeaturedMedia> => {
  try {
    const featuredMediaByIdUrl = getUrl(`/wp-json/wp/v2/media/${id}`);

    const featuredMediaById = await wordPressFetch<FeaturedMedia>(featuredMediaByIdUrl, {
      next: {
        ...defaultFetchOptions.next,
        tags: mergeQueryTags(defaultFetchOptions.next?.tags, [`featured-media-by-id-${id}`])
      }
    });

    return featuredMediaById;
  } catch (error: any) {
    throw new Error(`${GET_FEATURED_MEDIA_BY_ID_ERROR_DETAILS} ${error.message}`);
  }
};