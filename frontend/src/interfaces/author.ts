import { Image, SEO } from "@/interfaces/strapi";

export interface AuthorInterface {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  seo?: SEO;
}
