import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { SEO } from "@/interfaces/strapi";

export interface StrapiCategory {
  id: number;
  attributes: {
    text: string;
    slug: string;
  };
}

// Типы для запросов
export type CategoryRequest = {
  data: Category[];
};

type Category = {
  name: string;
  slug: string;
  description: string;
  category: number;
  seo?: SEO;
};

type Response = {
  success: boolean;
  category?: StrapiCategory;
  error?: string;
};

export async function POST(request: Request) {
  const { data } = (await request.json()) as CategoryRequest;

  await Promise.all(
    data.map(async (d) => {
      const { name, slug } = d;
      // Валидация
      if (!name || !slug) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.STRAPI_API_TOKEN && {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
              }),
            },
            body: JSON.stringify({
              data: d,
            }),
          },
        );

        if (!res.ok) {
          const errorData = await res.json();

          throw new Error(
            JSON.stringify(errorData) || "Failed to create article",
          );
        }

        const response = (await res.json()) as { data: StrapiCategory };

        return NextResponse.json({
          success: true,
          category: response.data,
        } satisfies Response);
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
