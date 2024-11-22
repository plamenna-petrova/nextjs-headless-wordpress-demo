"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
}

const PostsFilter = ({ authors, tags, categories, selectedAuthor, selectedTag, selectedCategory }: PostsFilterProps) => {
  const router = useRouter();

  const handleFilterChange = (type: string, value: string): void => {
    const newURLSearchParams: URLSearchParams = new URLSearchParams(window.location.search);

    if (value === "all") {
      newURLSearchParams.delete(type);
    } else {
      newURLSearchParams.set(type, value);
    }

    router.push(`/posts?${newURLSearchParams.toString()}`);
  };

  const handleResetFilters = (): void => {
    router.push("/posts");
  };

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value: string) => handleFilterChange("tag", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
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
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
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
          <SelectValue placeholder="All Authors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author.id} value={author.id.toString()}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}

export default PostsFilter;