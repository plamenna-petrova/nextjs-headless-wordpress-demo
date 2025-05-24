"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";

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
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
  filterLabels: Record<string, string>;
}

const PostsFilter = ({
  authors,
  tags,
  categories,
  selectedAuthor,
  selectedTag,
  selectedCategory,
  filterLabels
}: PostsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = pathname.split("/")[1] || "bg" as Locale;

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
    router.push(`/${locale}/posts?page=1`);
  };

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value: string) => handleFilterChange("tag", value)}
      >
        <SelectTrigger>
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
        <SelectTrigger>
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
        <SelectTrigger>
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
  );
}

export default PostsFilter;