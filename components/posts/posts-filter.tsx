"use client";

import { usePathname, useRouter, useSearchParams, ReadonlyURLSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocale, useTranslations } from "next-intl";

interface Author {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

type PostsFilterProps = {
  defaultSearchValue?: string;
  translatedSearchPlaceholder?: string;
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
  filterLabels: Record<string, string>;
}

const PostsFilter = ({
  defaultSearchValue,
  translatedSearchPlaceholder,
  authors,
  tags,
  categories,
  selectedAuthor,
  selectedTag,
  selectedCategory,
  filterLabels
}: PostsFilterProps) => {
  const [postsSearchInputValue, setPostsSearchInputValue] = useState<string>(defaultSearchValue || "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const t = useTranslations("Blog.filters");
  const locale = useLocale() as Locale;

  const handlePostsSearchChange = (event: ChangeEvent<HTMLInputElement>): void => { 
    const postsSearchTerm = event.target.value;
    setPostsSearchInputValue(postsSearchTerm);
    handlePostsSearch(postsSearchTerm);
  }

  const handlePostsSearch = useDebouncedCallback((searchTerm: string): void => {
    const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);

    if (searchTerm) {
      urlSearchParams.set("search", searchTerm);
    } else {
      urlSearchParams.delete("search");
    }

    router.replace(`${pathname}?${urlSearchParams.toString()}`);
  }, 300);

  const handleFilterChange = (type: string, value: string): void => {
    const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString() || "");

    if (value === "all") {
      urlSearchParams.delete(type);
    } else {
      urlSearchParams.set(type, value);
    }

    router.push(`/${locale}/posts?${urlSearchParams.toString()}`);
  };

  const handleResetFilters = (): void => {
    setPostsSearchInputValue("");
    router.push(`/${locale}/posts?page=1`);
  };

  return (
    <div className="flex flex-col my-4">
      <Input
        type="text"
        name="search"
        placeholder={translatedSearchPlaceholder}
        value={postsSearchInputValue}
        onChange={handlePostsSearchChange}
      />
      <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
        <Select
          value={selectedTag || "all"}
          onValueChange={(value: string) => handleFilterChange("tag", value)}
        >
          <SelectTrigger aria-label={t("tagsFilter")}>
            <SelectValue placeholder={filterLabels.allTags} />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="all">{filterLabels.allTags}</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id.toString()}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value: string) => handleFilterChange("category", value)}
        >
          <SelectTrigger aria-label={t("categoriesFilter")}>
            <SelectValue placeholder={filterLabels.allCategories} />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="all">{filterLabels.allCategories}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedAuthor || "all"}
          onValueChange={(value: string) => handleFilterChange("author", value)}
        >
          <SelectTrigger aria-label={t("authorsFilter")}>
            <SelectValue placeholder={filterLabels.allAuthors} />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="all">{filterLabels.allAuthors}</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id.toString()}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleResetFilters}>
          {filterLabels.clearFilters}
        </Button>
      </div>
    </div>
  );
}

export default PostsFilter;