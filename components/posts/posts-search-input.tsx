"use client";

import { Input } from "@/components/ui/input";
import { ReadonlyURLSearchParams, usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export function PostsSearchInput({ defaultValue }: { defaultValue?: string }) {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const pathname: string = usePathname();
  const { replace } = useRouter();

  const handlePostsSearch = useDebouncedCallback((searchTerm: string): void => {
    const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);

    if (searchTerm) {
      urlSearchParams.set("search", searchTerm);
    } else {
      urlSearchParams.delete("search");
    }

    replace(`${pathname}?${urlSearchParams.toString()}`);
  }, 300);

  return (
    <Input
      type="text"
      name="search"
      placeholder="Search posts..."
      defaultValue={defaultValue} 
      onChange={(event: ChangeEvent<HTMLInputElement>) => handlePostsSearch(event.target.value)}
    />
  )
}