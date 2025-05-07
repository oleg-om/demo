import Cards from "@/components/Cards";
import Sidebar from "@/components/Sidebar";
import { getArticles, getMainPage } from "@/api/facade";
import { ArticleInterface } from "@/interfaces/article";
import { notFound } from "next/navigation";
import { metadata } from "@/app/layout";
import { PaginationStrapi } from "@/interfaces/strapi";
import { ARTICLE_PAGE_SIZE } from "@/constants/common";

type Props = {
  params: Promise<{ page: string }>;
};

export default async function HomePage({ params }: Props) {
  let data: ArticleInterface[];
  let pagination: PaginationStrapi;
  const { page } = await params;

  try {
    const articles = await getArticles({
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
      <Sidebar />
      <Cards data={data} pagination={pagination} />
    </>
  );
}

export async function generateMetadata() {
  const seo = await getMainPage();
  return {
    title: seo?.metaTitle || metadata.title,
    description: seo?.metaDescription || metadata.description,
  };
}
