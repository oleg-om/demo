import { Image } from "@/interfaces/strapi";
import { ImageSize } from "@/enums/imageSize";

export const getImage = (img: Image, imageSize = ImageSize.original) => {
  let image: string;
  if (
    imageSize !== ImageSize.original &&
    !!img?.formats &&
    img?.formats[imageSize]?.url
  ) {
    image = img?.formats[imageSize]?.url;
  } else {
    image = img?.url || "/no-image.png";
  }

  return `${process.env.NEXT_PUBLIC_API_EXTERNAL_URL}${image}`;
};
