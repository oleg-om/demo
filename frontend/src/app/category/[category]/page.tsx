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

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  let data: ArticleInterface[];
  let categoryData: CategoryInterface;

  try {
    categoryData = await getCategory({ slug: category });

    if (!categoryData || !categoryData?.slug) {
      notFound();
    }

    const articles = await getArticles({ category });
    data = articles.data;

    if (!data || data.length === 0) {
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
        <Cards data={data} />
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
