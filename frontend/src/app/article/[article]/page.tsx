import Sidebar from "@/components/Sidebar";
import Cards from "@/components/Cards";
import { ArticleInterface } from "@/interfaces/article";
import { getAllArticles, getArticles } from "@/api/facade";
import { notFound } from "next/navigation";
import React from "react";
import Card from "@/components/Card";
import styles from "./page.module.scss";
import { SubTitle } from "@/components/Subtitle";
import { getArticleSEO } from "@/lib/seo";

type Props = {
  params: Promise<{ article: string }>;
};

export default async function ArticlePage({ params }: Props) {
  let data: ArticleInterface;
  let related: ArticleInterface[] = [];

  const { article } = await params;

  try {
    const singleArticle = await getArticles({ slug: article });
    data = singleArticle.data[0];

    if (!article || singleArticle?.data?.length === 0) {
      notFound();
    }

    const articles = await getArticles({
      excludeSlug: article,
      category: data.category.slug,
    });
    if (articles?.data?.length) {
      related = articles.data;
    }

    if (!related) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <Card article={data} showFull={true} />
        {!!related?.length && (
          <>
            <SubTitle text="recommendations" />
            <Cards data={related} />
          </>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  console.log("URL", process.env.NEXT_PUBLIC_API_URL);
  return articles.map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { article } = await params;
  const articles = await getArticles({ slug: article });
  const articlesData = articles.data[0];

  return getArticleSEO(articlesData);
}
