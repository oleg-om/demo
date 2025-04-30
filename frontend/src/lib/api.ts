import fetch from "node-fetch";
import FormData from "form-data";
import sharp from "sharp";
import { StrapiImage } from "@/app/api/articles/route";

export async function postImage(
  imageUrl: string,
  prefix: string = "article",
): Promise<StrapiImage> {
  // 1. Скачиваем изображение
  const imageRes = await fetch(imageUrl);

  if (!imageRes.ok) throw new Error("Failed to download image");
  const originalBuffer = Buffer.from(await imageRes.arrayBuffer());

  // Сжатие: меняем размер и качество
  const compressedBuffer = await sharp(originalBuffer)
    .resize({ width: 1200 }) // можно задать любые параметры
    .jpeg({ quality: 75 }) // уменьшаем качество
    .toBuffer();

  // 2. Загружаем в Strapi через FormData
  const form = new FormData();
  form.append("files", Buffer.from(compressedBuffer), {
    filename: `${prefix}-${Date.now()}`,
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
