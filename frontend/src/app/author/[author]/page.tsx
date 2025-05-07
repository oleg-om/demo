import Sidebar from "@/components/Sidebar";
import styles from "@/app/article/[article]/page.module.scss";
import Cards from "@/components/Cards";
import React from "react";
import { ArticleInterface } from "@/interfaces/article";
import { getAllAuthors, getArticles, getAuthors } from "@/api/facade";
import { notFound } from "next/navigation";
import { Title } from "@/components/Title";
import { CategoryInterface } from "@/interfaces/category";
import { getAuthorSEO } from "@/lib/seo";
import { ARTICLE_PAGE_SIZE } from "@/constants/common";
import { PaginationStrapi } from "@/interfaces/strapi";

type Props = {
  params: Promise<{ author: string }>;
};

export default async function AuthorPage({ params }: Props) {
  const { author } = await params;
  let data: ArticleInterface[];
  let authorsData: CategoryInterface;
  let pagination: PaginationStrapi;

  try {
    const authors = await getAuthors({ slug: author });
    authorsData = authors.data[0];

    if (!authorsData || !authorsData?.slug) {
      notFound();
    }

    const articles = await getArticles({
      author,
      pagination: { pageSize: ARTICLE_PAGE_SIZE, page: 1 },
    });
    data = articles.data;
    pagination = articles.meta.pagination;

    if (!data) {
      notFound();
    }
  } catch {
    notFound();
  }
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <Title text={`${authorsData.name}:`} />
        <Cards data={data} pagination={pagination} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const authors = await getAllAuthors();

  return authors.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { author } = await params;
  const authors = await getAuthors({ slug: author });
  const authorsData = authors.data[0];

  return getAuthorSEO(authorsData);
}
