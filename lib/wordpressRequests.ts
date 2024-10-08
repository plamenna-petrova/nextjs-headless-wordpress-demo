import { Post } from "@/types/Post";
import queryString from "query-string";

const baseUrl = 'http://wordpress.local/';
 
const getUrl = (path: string, query?: Record<string, any>): string => {
    const queryParameters: string | null = query ? queryString.stringify(query) : null;
    return `${baseUrl}${path}${queryParameters ? `?${queryParameters}` : ''}`;
}

export const getAllPosts = async (filterParameters: { 
    author?: string;
    tag?: string;
    category?: string
}): Promise<Post[]> => {
    const postsUrl = getUrl('/wp-json/wp/v2/posts', 
        { 
            author: filterParameters?.author, 
            tags: filterParameters.tag, 
            categories: filterParameters.category 
        }
    );
    
    const postsResponse = await fetch(postsUrl);
    const posts: Post[] = await postsResponse.json();
    
    return posts;
}