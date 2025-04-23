import { Image } from "@/interfaces/strapi";

export const getImage = (img: Image) => {
  return img?.url
    ? `${process.env.NEXT_PUBLIC_DOMAIN}${img.url}`
    : "/no-image.png";
};
