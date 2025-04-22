import { Image } from "@/interfaces/strapi";

export const getImage = (img: Image) => {
  return img?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${img.url}`
    : "/no-image.png";
};
