import { Post } from "@/types/Post";
import queryString from "query-string";

const baseUrl = 'http://localhost/wordpress/';
 
const getUrl = (path: string, queryParametersRecord?: Record<string, any>): string => {
    const stringifiedQueryParameters: string | null = queryParametersRecord ? queryString.stringify(queryParametersRecord) : null;
    return `${baseUrl}${path}${stringifiedQueryParameters ? `?${stringifiedQueryParameters}` : ''}`;
}

export const getAllPosts = async (filterParameters: { 
    author?: string;
    tag?: string;
    category?: string
}): Promise<Post[]> => {
    const postsUrl: string = getUrl('/wp-json/wp/v2/posts', 
        { 
            author: filterParameters?.author, 
            tags: filterParameters.tag, 
            categories: filterParameters.category 
        }
    );
    
    const postsResponse: Response = await fetch(postsUrl);
    const posts: Post[] = await postsResponse.json();
    
    return posts;
}