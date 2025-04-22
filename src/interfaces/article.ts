import { Image, SEO } from "@/interfaces/strapi";
import { AuthorInterface } from "@/interfaces/author";
import { CategoryInterface } from "@/interfaces/category";

export interface ArticleInterface {
  id: number;
  documentId: string;
  slug: string;
  description: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  author: AuthorInterface;
  category: CategoryInterface;
  localizations: string[];
  title: string;
  seo?: SEO;
}
