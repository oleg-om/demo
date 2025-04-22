import Cards from "@/components/Cards";
import Sidebar from "@/components/Sidebar";
import { getArticles, getMainPage } from "@/api/facade";
import { ArticleInterface } from "@/interfaces/article";
import { notFound } from "next/navigation";

export default async function HomePage() {
  return <Home />;
}

export type HomeProps = {
  category?: string;
  author?: string;
  article?: string;
};

export async function Home({ category, author }: HomeProps) {
  let data: ArticleInterface[];

  try {
    const articles = await getArticles({ category, author });
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
      <Cards data={data} />
    </>
  );
}

export async function generateMetadata() {
  const seo = await getMainPage();
  return {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
  };
}
