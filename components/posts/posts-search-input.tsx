"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { ReadonlyURLSearchParams, usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export function PostsSearchInput({ defaultValue, translatedPlaceholder }: { defaultValue?: string, translatedPlaceholder?: string }) {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const t = useTranslations("Blog.search");
  const pathname = usePathname();
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
      placeholder={translatedPlaceholder}
      defaultValue={defaultValue} 
      onChange={(event: ChangeEvent<HTMLInputElement>) => handlePostsSearch(event.target.value)}
      aria-label={t("searchPosts")}
    />
  )
}