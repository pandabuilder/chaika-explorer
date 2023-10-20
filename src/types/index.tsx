export interface Tag {
  name: string;
  scope: string;
  full: string;
}

export interface ArchiveOrGalleryInfo {
  _id: string;
  title: string;
  title_jpn: string;
  tags: Tag[];
  public_date: string;
  original_date: string;
  posted_date: string;
  size: number;
  image_count: number;
  thumbnail: string;
  source_type: string;
  provider: string;
  reason: string;
  category: string;
  source_url?: string;
  uploader?: string;
}

export interface indexConfigInfo {
  name: string;
  mainSite: string;
  apiUrl: string;
  indexName: string;
  indexIsGallery: boolean;
}