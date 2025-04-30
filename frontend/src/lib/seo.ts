import { AuthorInterface } from "@/interfaces/author";
import { Metadata } from "next";
import { ArticleInterface } from "@/interfaces/article";
import { CategoryInterface } from "@/interfaces/category";
import { ROUTES } from "@/constants/routes";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

export const getAuthorSEO = (author: AuthorInterface): Metadata => {
  return {
    title:
      author?.seo?.metaTitle || `Articles by ${author.name} | ${SITE_NAME}`,
    description:
      author?.seo?.metaDescription ||
      `Read expert articles by ${author.name} on topics like IT, earnings, and more. Discover insights into IT, science, and modern technologies`,
    ...(author.image?.url && {
      openGraph: {
        images: [author.image.url],
      },
    }),
  };
};

export const getArticleSEO = (article: ArticleInterface): Metadata => {
  const title =
    article?.seo?.metaTitle ||
    `${article.title} | ${article.category.name} | ${SITE_NAME}`;
  const description =
    article?.seo?.metaDescription ||
    `Explore ${article.category.name}. Written by ${article.author.name}, this ${article.category.name} article covers insights, trends, and expert analysis`;
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}${ROUTES.ARTICLE(article.slug)}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      url,
      authors: [article.author.name],
      ...(article.image?.url && { images: [article.image.url] }),
      title,
      description,
      locale: "en",
    },
    alternates: {
      canonical: url,
    },
  };
};

export const getCategorySEO = (category: CategoryInterface): Metadata => {
  return {
    title:
      category?.seo?.metaTitle ||
      `Latest in ${category.name} | Insights & Trends | ${SITE_NAME}`,
    description:
      category?.seo?.metaDescription ||
      `Stay updated with the latest articles in ${category.name}—covering trends, innovations, and expert opinions in industry.`,
  };
};
