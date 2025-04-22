import {
  PageResponse,
  Pagination,
  SEO,
  StrapiResponse,
} from "@/interfaces/strapi";
import { apiFetch } from "@/api/client";
import { ArticleInterface } from "@/interfaces/article";
import { AuthorInterface } from "@/interfaces/author";
import { CategoryInterface } from "@/interfaces/category";

const REVALIDATE = 60;

type getArticlesProps = {
  slug?: string;
  category?: string;
  author?: string;
  excludeSlug?: string;
  pagination?: Pagination;
};

// Получаем статьи
export const getArticles = (
  props?: getArticlesProps,
): Promise<StrapiResponse<ArticleInterface[]>> => {
  const query = new URLSearchParams();
  query.set("populate[author][populate]", "image");
  query.set("populate[image][fields][0]", "url");
  query.set("populate[category][fields][0]", "slug");
  query.set("populate[category][fields][1]", "name");

  if (props?.slug) {
    query.set("filters[slug][$eq]", props.slug);
  }
  if (props?.category) {
    query.set("filters[category][slug][$eq]", props.category);
  }
  if (props?.author) {
    query.set("filters[author][slug][$eq]", props.author);
  }
  if (props?.excludeSlug) {
    query.set("filters[slug][$ne]", props.excludeSlug);
  }
  if (props?.pagination) {
    Object.entries(props.pagination).forEach(([key, value]) => {
      query.set(`pagination[${key}]`, value);
    });
  }

  return apiFetch(
    "/api/articles",
    {
      method: "GET",
      next: { revalidate: REVALIDATE },
    },
    query,
  );
};

const getTotalArticlesCount = async (): Promise<number> => {
  const { meta } = await getArticles();
  return meta.pagination.total || 0;
};

// получаем все статьи для generateStaticParams
export const getAllArticles = async (): Promise<ArticleInterface[]> => {
  const pageCount = await getTotalArticlesCount();

  const articles: ArticleInterface[] = [];

  const { data } = await getArticles({ pagination: { pageCount } });
  articles.push(...data);

  return articles;
};

type apiProps = {
  slug?: string;
  pagination?: Pagination;
};

// Получаем авторов
export const getAuthors = (
  props?: apiProps,
): Promise<StrapiResponse<AuthorInterface[]>> => {
  const query = new URLSearchParams();
  query.set("populate", "*");

  if (props?.slug) {
    query.set("filters[slug][$eq]", props.slug);
  }
  if (props?.pagination) {
    Object.entries(props.pagination).forEach(([key, value]) => {
      query.set(`pagination[${key}]`, value);
    });
  }

  return apiFetch(
    "/api/authors",
    {
      method: "GET",
      next: { revalidate: REVALIDATE },
    },
    query,
  );
};

// Получаем все авторы для generateStaticParams
export const getAllAuthors = async (): Promise<AuthorInterface[]> => {
  const { data } = await getAuthors({ pagination: { pageSize: 9999 } });

  return data;
};

// Получаем категории
export const getCategories = (
  props?: apiProps,
): Promise<StrapiResponse<CategoryInterface[]>> => {
  const query = new URLSearchParams();
  query.set("populate", "*");

  if (props?.slug) {
    query.set("filters[slug][$eq]", props.slug);
  }
  if (props?.pagination) {
    Object.entries(props.pagination).forEach(([key, value]) => {
      query.set(`pagination[${key}]`, value);
    });
  }

  return apiFetch(
    "/api/categories",
    {
      method: "GET",
      next: { revalidate: REVALIDATE },
    },
    query,
  );
};

// Получаем категорию
export const getCategory = async (
  props?: apiProps,
): Promise<CategoryInterface> => {
  const { data } = await getCategories({ slug: props?.slug });

  return data[0];
};

// Получаем все категориии для generateStaticParams
export const getAllCategories = async (): Promise<CategoryInterface[]> => {
  const { data } = await getCategories({ pagination: { pageSize: 9999 } });

  return data;
};

// Получаем категории
export const getMainPage = async (): Promise<SEO> => {
  const query = new URLSearchParams();
  query.set("populate", "*");
  const { data } = await apiFetch<StrapiResponse<PageResponse>>(
    "/api/main-page",
    {
      method: "GET",
      next: { revalidate: REVALIDATE },
    },
    query,
  );

  return data.seo;
};
