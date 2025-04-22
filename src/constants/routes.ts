export const ROUTES = {
  HOME: "/",
  AUTHOR: (slug: string) => `/author/${slug}`,
  CATEGORY: (slug: string) => `/category/${slug}`,
  ARTICLE: (slug: string) => `/article/${slug}`,
};
