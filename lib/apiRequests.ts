import { Post } from "@/types/Post";

export const fetchPosts = async (params: { [key: string]: string | undefined }): Promise<Post[]> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined)
  );

  const searchParams = new URLSearchParams(cleanedParams as Record<string, string>);

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts?${searchParams}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};
