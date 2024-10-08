
export type SearchResult = {
    id: number;
    title: string;
    url: string;
    type: string;
    subtype: string;
    _links: {
        self: {
            embeddable: boolean;
            href: string;
        }[];
        about: {
            href: string;
        }[];
    };
};
