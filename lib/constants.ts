import { translateHTML } from "./translateHTML";
import { Locale } from "@/lib/i18n";

export const buildMainMenu = (locale: string): Record<string, string> => ({
  'начало': "/",
  'блог': `/${locale}/posts?page=1`,
});

export const buildContentMenu = (locale: string): Record<string, string> => ({
  категории: `/${locale}/posts/categories`,
  етикети: `/${locale}/posts/tags`,
  aвтори: `/${locale}/posts/authors`,
});

export const GET_ALL_POSTS_ERROR_DETAILS: string = "Unable to retrieve posts.";

export const GET_POST_BY_ID_ERROR_DETAILS: string = "Unable to retrieve post by Id.";

export const GET_POST_BY_SLUG_ERROR_DETAILS: string = "Unable to retrieve post by slug.";

export const GET_ALL_CATEGORIES_ERROR_DETAILS: string = "Unable to retrieve categories.";

export const GET_CATEGORY_BY_ID_ERROR_DETAILS: string = "Unable to retrieve category by Id.";

export const GET_CATEGORY_BY_SLUG_ERROR_DETAILS: string = "Unable to retrieve category by slug.";

export const GET_POSTS_BY_CATEGORY_ERROR_DETAILS: string = "Unable to retrieve posts by category.";

export const GET_POSTS_BY_TAG_ERROR_DETAILS: string = "Unable to retrieve posts by tag.";

export const GET_ALL_TAGS_ERROR_DETAILS: string = "Unable to retrieve tags.";

export const GET_TAG_BY_ID_ERROR_DETAILS: string = "Unable to retrieve tag by Id.";

export const GET_TAG_BY_SLUG_ERROR_DETAILS: string = "Unable to retrieve tag by slug.";

export const GET_TAGS_BY_POST_ERROR_DETAILS: string = "Unable to retrieve tags by post.";

export const GET_ALL_PAGES_ERROR_DETAILS: string = "Unable to retrieve pages.";

export const GET_PAGE_BY_ID_ERROR_DETAILS: string = "Unable to retrieve page by Id.";

export const GET_PAGE_BY_SLUG_ERROR_DETAILS: string = "Unable to retrieve page by slug.";

export const GET_ALL_AUTHORS_ERROR_DETAILS: string = "Unable to retrieve authors.";

export const GET_AUTHOR_BY_ERROR_DETAILS: string = "Unable to retrieve author by Id.";

export const GET_AUTHOR_BY_SLUG_ERROR_DETAILS: string = "Unable to retrieve author by slug.";

export const GET_POSTS_BY_AUTHOR_ID_ERROR_DETAILS: string = "Unable to retrieve posts by author Id.";

export const GET_POSTS_BY_AUTHOR_SLUG_ERROR_DETAILS: string = "Unable to retrieve posts by author slug.";

export const GET_POSTS_BY_CATEGORY_SLUG_ERROR_DETAILS: string = "Unable to retrieve posts by category slug.";

export const GET_POSTS_BY_TAG_SLUG_ERROR_DETAILS = "Unable to retrieve posts by tag slug.";

export const GET_FEATURED_MEDIA_BY_ID_ERROR_DETAILS = "Unable to retrieve featured media by Id.";

export const UNKNOWN_ERROR_DETAILS: string = "An unknown error occurred";

export const WORDPRESS_FETCH_ERROR_DETAILS: string = "Error fetching from WordPress";