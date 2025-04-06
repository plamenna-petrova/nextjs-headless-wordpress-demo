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
    const urlSearchParams: URLSearchParams = new URLSearchParams(window.location.search);

    if (value === "all") {
      urlSearchParams.delete(type);
    } else {
      urlSearchParams.set(type, value);
    }

    router.push(`/posts?${urlSearchParams.toString()}`);
  };

  const handleResetFilters = (): void => {
    router.push("/posts?page=1");
  };

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value: string) => handleFilterChange("tag", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Всички етикети" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">Всички етикети</SelectItem>
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
          <SelectValue placeholder="Всички категории" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">Всички категории</SelectItem>
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
          <SelectValue placeholder="Всички автори" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">Всички автори</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author.id} value={author.id.toString()}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleResetFilters}>
        Премахнете филтрите
      </Button>
    </div>
  );
}

export default PostsFilter;