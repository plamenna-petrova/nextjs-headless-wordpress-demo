
export type Category = {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: "category";
    parent: number;
    meta: any[];
};