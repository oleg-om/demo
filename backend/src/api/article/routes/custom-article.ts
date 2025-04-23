export default [
  {
    method: "POST",
    path: "/articles/with-image-url",
    handler: "article.createWithImageUrl",
    config: {
      auth: false, // или true
    },
  },
];
