import { SEO } from "@/interfaces/strapi";

export interface CategoryInterface {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  seo?: SEO;
}
