import Sidebar from "@/components/Sidebar";
import styles from "@/app/article/[article]/page.module.scss";
import Cards from "@/components/Cards";
import React from "react";
import { ArticleInterface } from "@/interfaces/article";
import { getAllCategories, getArticles, getCategory } from "@/api/facade";
import { notFound } from "next/navigation";
import { Title } from "@/components/Title";
import { CategoryInterface } from "@/interfaces/category";
import { getCategorySEO } from "@/lib/seo";
import { ARTICLE_PAGE_SIZE } from "@/constants/common";
import { PaginationStrapi } from "@/interfaces/strapi";

type Props = {
  params: Promise<{ category: string; page: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category, page } = await params;
  let data: ArticleInterface[];
  let categoryData: CategoryInterface;
  let pagination: PaginationStrapi;

  try {
    categoryData = await getCategory({ slug: category });

    if (!categoryData || !categoryData?.slug) {
      notFound();
    }

    const articles = await getArticles({
      category,
      pagination: { pageSize: ARTICLE_PAGE_SIZE, page: Number(page) },
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
      <Sidebar activeCategory={category} />
      <div className={styles.content}>
        <Title text={`${categoryData.name}:`} />
        <Cards data={data} pagination={pagination} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const categoryData = await getCategory({ slug: category });

  return getCategorySEO(categoryData);
}
