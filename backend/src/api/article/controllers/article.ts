/**
 * article controller
 */

import { factories } from "@strapi/strapi";
import axios from "axios";
import { Readable } from "node:stream";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async createWithImageUrl(ctx) {
      const {
        text,
        imageUrl,
        slug,
        description,
        author,
        category,
        seo,
        title,
      } = ctx.request.body;

      if (!imageUrl) {
        return ctx.badRequest("imageUrl is required");
      }

      try {
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "binary");
        const stream = Readable.from(buffer);

        const uploadedFiles = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            data: {},
            files: {
              path: null,
              name: "external-image.jpg",
              type: response.headers["content-type"],
              size: buffer.length,
              stream,
            },
          });

        const image = uploadedFiles[0];

        const article = await strapi.entityService.create(
          "api::article.article",
          {
            data: {
              text,
              slug,
              description,
              author,
              category,
              seo,
              title,
              image: image.id,
            },
          },
        );

        return article;
      } catch (err) {
        console.error("Image upload error:", err);
        return ctx.internalServerError(
          "Failed to upload image or create article",
        );
      }
    },
  }),
);
