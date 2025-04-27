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
  data: Article;
};

type Article = {
  title: string;
  text: string;
  slug: string;
  imageUrl: string;
  description: string;
  author: number;
  category: number;
  seo?: SEO;
};

export type ArticleResponse = {
  success: boolean;
  article?: StrapiArticle;
  image?: StrapiImage;
  error?: string;
};

export async function POST(request: Request) {
  const { data } = (await request.json()) as ArticleRequest;

  const { text, slug, imageUrl, description, author, category, title, seo } =
    data;
  // Валидация
  if (!text || !slug || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const imageData = await postImage(imageUrl);

    // Поиск всех ссылок на картинки
    function extractImageUrls(text: string): string[] {
      const regex = /https?:\/\/[^\s"'()]+?\.(?:png|jpg|jpeg|gif|webp|svg)/gi;
      return Array.from(new Set(text.match(regex) || []));
    }

    let textWithImages: string = text;

    if (text) {
      const urls = extractImageUrls(text);

      for (const imageUrl of urls) {
        try {
          const uploadedUrl = await postImage(imageUrl);
          if (uploadedUrl?.attributes?.url) {
            textWithImages = text.replaceAll(
              imageUrl,
              uploadedUrl.attributes.url,
            );
          }
        } catch (err) {
          console.warn("Не удалось загрузить изображение:", imageUrl, err);
        }
      }
    }

    // 3. Создаем статью
    const articleRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
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
            text: textWithImages || text,
            slug,
            image: imageData.id,
            description,
            author,
            category,
            title,
            seo,
          },
        }),
      },
    );

    if (!articleRes.ok) {
      const errorData = await articleRes.json();

      throw new Error(JSON.stringify(errorData) || "Failed to create article");
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
}
