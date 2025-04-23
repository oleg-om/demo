import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";
import { SEO } from "@/interfaces/strapi";

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

export async function postImage(imageUrl: string): Promise<StrapiImage> {
  // 1. Скачиваем изображение
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error("Failed to download image");

  const imageBuffer = await imageRes.arrayBuffer();

  // 2. Загружаем в Strapi через FormData
  const form = new FormData();
  form.append("files", Buffer.from(imageBuffer), {
    filename: `article-${Date.now()}.jpg`,
    contentType: imageRes.headers.get("content-type") || "image/jpeg",
  });

  const uploadRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
    {
      method: "POST",
      headers: {
        ...(process.env.STRAPI_API_TOKEN && {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        }),
        ...form.getHeaders(),
      },
      body: form,
    },
  );

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    // @ts-ignore
    throw new Error(errorData.message || "Strapi upload failed");
  }

  const [imageData] = (await uploadRes.json()) as StrapiImage[];

  return imageData;
}

export async function POST(request: Request) {
  const { text, slug, imageUrl, description, author, category, title, seo } =
    (await request.json()) as ArticleRequest;

  let textWithImages: string;

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
            // @ts-ignore
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
      console.log("test", errorData);
      // @ts-ignore
      throw new Error(errorData.error?.message || "Failed to create article");
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
