import Cards from "@/components/Cards";
import Sidebar from "@/components/Sidebar";
import { getArticles, getMainPage } from "@/api/facade";
import { ArticleInterface } from "@/interfaces/article";
import { notFound } from "next/navigation";
import { metadata } from "@/app/layout";

export default async function HomePage() {
  let data: ArticleInterface[];

  try {
    const articles = await getArticles();
    data = articles.data;

    if (!data) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <>
      <Sidebar />
      <Cards data={data} />
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
