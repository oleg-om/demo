import { getAllArticles } from "@/api/facade";
import { ROUTES } from "@/constants/routes";

type SiteMapItem = {
  page: string;
  lastMod: string;
  changeFreq: string;
  priority?: string;
};

export const dynamic = "force-dynamic"; // важно для динамической генерации

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "https://yourdomain.com";

  // Здесь можешь динамически получать список путей, например, из базы данных
  const staticPages: SiteMapItem[] = [
    {
      page: "/",
      lastMod: new Date().toISOString(),
      changeFreq: "weekly",
      priority: "1.0",
    },
  ];

  const dynamicPages: SiteMapItem[] = [];

  const articles = await getAllArticles();
  const articlesSitemap: SiteMapItem[] = articles.map((a) => {
    return {
      page: ROUTES.ARTICLE(a.slug),
      lastMod: a.updatedAt,
      changeFreq: "yearly",
      priority: "0.8",
    };
  });

  dynamicPages.push(...articlesSitemap);

  const pages: SiteMapItem[] = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
        <url>
          <loc>${baseUrl}${page.page}</loc>
          <lastmod>${page.lastMod}</lastmod>
          <changefreq>${page.changeFreq}</changefreq>
          <priority>${page?.priority || "0.8"}</priority>
        </url>
      `;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
