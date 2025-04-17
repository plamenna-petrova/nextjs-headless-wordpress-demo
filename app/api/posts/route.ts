import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/wordpressRequests";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filterParams = {
      search: searchParams.get("search") || undefined,
      author: searchParams.get("author") || undefined,
      tag: searchParams.get("tag") || undefined,
      category: searchParams.get("category") || undefined,
    };

    const posts = await getAllPosts(filterParams);

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}