import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { SEO } from "@/interfaces/strapi";
import { postImage } from "@/lib/api";

// Типы для Strapi API
export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    name: string;
  };
}

export interface StrapiArticle {
  id: number;
  attributes: {
    text: string;
    slug: string;
    cover: { data: StrapiImage };
  };
}

// Типы для запросов
export type ArticleRequest = {
  data: Author[];
};

type Author = {
  slug: string;
  name: string;
  imageUrl: string;
  categories: number[];
  seo?: SEO;
};

export type ArticleResponse = {
  success: boolean;
  article?: StrapiArticle;
  image?: StrapiImage | null;
  error?: string;
};

export async function POST(request: Request) {
  const { data } = (await request.json()) as ArticleRequest;

  await Promise.all(
    data.map(async (d) => {
      const { slug, imageUrl, name, categories, seo } = d;
      // Валидация
      if (!name || !slug || !imageUrl) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      let imageData: StrapiImage | null = null;

      try {
        imageData = await postImage(imageUrl, "author");
      } catch {
        imageData = null;
      }

      try {
        // 3. Создаем статью
        const articleRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/authors`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.STRAPI_API_TOKEN && {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
              }),
            },
            body: JSON.stringify({
              data: {
                slug,
                ...(imageData && { image: imageData.id }),
                name,
                categories,
                seo,
              },
            }),
          },
        );

        if (!articleRes.ok) {
          const errorData = await articleRes.json();

          throw new Error(
            JSON.stringify(errorData) || "Failed to create authors",
          );
        }

        const article = (await articleRes.json()) as { data: StrapiArticle };

        return NextResponse.json({
          success: true,
          article: article.data,
          image: imageData,
        } satisfies ArticleResponse);
      } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 },
        );
      }
    }),
  );
}
