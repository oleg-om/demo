import fetch from "node-fetch";
import FormData from "form-data";
import { StrapiImage } from "@/app/api/articles/route";

export async function postImage(
  imageUrl: string,
  prefix: string = "article",
): Promise<StrapiImage> {
  // 1. Скачиваем изображение
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error("Failed to download image");

  const imageBuffer = await imageRes.arrayBuffer();

  // 2. Загружаем в Strapi через FormData
  const form = new FormData();
  form.append("files", Buffer.from(imageBuffer), {
    filename: `${prefix}-${Date.now()}.jpg`,
    contentType: imageRes.headers.get("content-type") || "image/jpeg",
  });

  const uploadRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_EXTERNAL_URL}/api/upload`,
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
    throw new Error(JSON.stringify(errorData) || "Strapi upload failed");
  }

  const [imageData] = (await uploadRes.json()) as StrapiImage[];

  return imageData;
}
