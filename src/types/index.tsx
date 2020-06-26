export interface Tag {
    name: string;
    scope: string;
    full: string;
}

export interface ArchiveInfo {
    _id: string;
    title: string;
    title_jpn: string;
    tags: Tag[];
    public_date: string;
    original_date: string;
    size: number;
    image_count: number;
    thumbnail: string;
    source_type: string;
    reason: string;
    category: string;
}